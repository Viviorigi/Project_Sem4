using AspnetApi.Dtos.Auth;
using AspnetApi.Dtos.Auth.Request;
using AspnetApi.Dtos.Auth.Response;
using AspnetApi.Models;
using AspnetApi.Services.Auth;
using AspnetApi.Services.Email;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AspnetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Identity package
        private readonly UserManager<Account> _userManager;
        private readonly IJwtService _jwtService;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;

        public AuthController(UserManager<Account> userManager, IJwtService jwtService, IMapper mapper, IEmailSender emailSender)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _mapper = mapper;
            _emailSender = emailSender;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDTO user)
        {
            if (ModelState.IsValid)
            {
                IdentityUser existingUser = await _userManager.FindByEmailAsync(user.Email);

                if (existingUser != null)
                {
                    return BadRequest(new RegisterResponseDTO()
                    {
                        Errors = new List<string>() { "Email already Registered" },
                        Success = false
                    });
                }

                Account newUser = new Account()
                {
                    Email = user.Email,
                    UserName = user.Username,
                };

                IdentityResult? created = await _userManager.CreateAsync(newUser, user.Password);

                if (created.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newUser, "User");

                    AuthResult authResult = await _jwtService.GenerateToken(newUser);
                    //return a token

                    var receiver = user.Email;
                    var subject = "🎉 Chào mừng bạn đến với PhoneStore!";
                    var message = $@"
                    <!DOCTYPE html>
                    <html lang='vi'>
                    <head>
                    <meta charset='UTF-8'>
                    <style>
                      body {{
                        font-family: 'Segoe UI', Arial, sans-serif;
                        background-color: #f6f8fb;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                      }}
                      .mail-box {{
                        max-width: 420px;
                        margin: auto;
                        background: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
                        overflow: hidden;
                      }}
                      .header {{
                        background: linear-gradient(120deg, #0d6efd, #6610f2);
                        color: white;
                        text-align: center;
                        padding: 18px;
                      }}
                      .header h1 {{
                        font-size: 22px;
                        margin: 0;
                      }}
                      .content {{
                        padding: 24px 20px;
                        text-align: center;
                      }}
                      .content h2 {{
                        color: #0d6efd;
                        font-size: 18px;
                        margin-bottom: 10px;
                      }}
                      .content p {{
                        font-size: 15px;
                        line-height: 1.6;
                        margin: 0;
                      }}
                      .footer {{
                        text-align: center;
                        font-size: 13px;
                        color: #777;
                        padding: 12px;
                        border-top: 1px solid #eee;
                      }}
                    </style>
                    </head>
                    <body>
                      <div class='mail-box'>
                        <div class='header'>
                          <h1>PhoneStore</h1>
                        </div>
                        <div class='content'>
                          <h2>Xin chào {user.Username} 👋</h2>
                          <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>PhoneStore</strong>.</p>
                          <p>Tài khoản của bạn đã được tạo thành công. Chúc bạn có trải nghiệm mua sắm tuyệt vời! 🎉</p>
                        </div>
                        <div class='footer'>
                          © 2025 PhoneStore. Cảm ơn bạn đã đồng hành cùng chúng tôi.
                        </div>
                      </div>
                    </body>
                    </html>";


                    await _emailSender.SendEmailAsync(receiver, subject, message);
                    return Ok(authResult);
                }
                else
                {
                    return BadRequest(new RegisterResponseDTO()
                    {
                        Errors = created.Errors.Select(e => e.Description).ToList(),
                        Success = false
                    });
                }
            }

            return BadRequest(new RegisterResponseDTO()
            {
                Errors = new List<string>() { "Invalid payload" },
                Success = false
            });
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDTO user)
        {
        if (ModelState.IsValid)
        {
          IdentityUser existingUser = await _userManager.FindByEmailAsync(user.Email);

          if (existingUser == null)
          {
              return BadRequest(new RegisterResponseDTO()
              {
                  Errors = new List<string>() { "Email address is not registered." },
                  Success = false
              });
          }
          var login = _mapper.Map<Account>(existingUser);
          bool isUserCorrect = await _userManager.CheckPasswordAsync(login, user.Password);
          if (isUserCorrect)
          {
              AuthResult authResult = await _jwtService.GenerateToken(login);
              //return a token
              return Ok(authResult);
          }
          else
          {
              return BadRequest(new RegisterResponseDTO()
              {
                  Errors = new List<string>() { "Wrong password" },
                  Success = false
              });
          }
        }

return BadRequest(new RegisterResponseDTO()
{
  Errors = new List<string>() { "Invalid payload" },
  Success = false
});
}

[HttpPost("refreshtoken")]
public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDTO tokenRequest)
{
if (ModelState.IsValid)
{
  var verified = await _jwtService.VerifyToken(tokenRequest);
  //
  if (!verified.Success)
  {
      return BadRequest(new AuthResult()
      {
          // Errors = new List<string> { "invalid Token" },
          Errors = verified.Errors,
          Success = false
      });
  }

  var tokenUser = await _userManager.FindByIdAsync(verified.UserId);
  var login = _mapper.Map<Account>(tokenUser);
  AuthResult authResult = await _jwtService.GenerateToken(login);
  //return a token
  return Ok(authResult);


}

return BadRequest(new AuthResult()
{
  Errors = new List<string> { "invalid Payload" },
  Success = false
});



}
}
}
