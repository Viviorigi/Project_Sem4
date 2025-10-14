using System.Net;
using System.Net.Mail;

namespace AspnetApi.Services.Email
{
    public class EmailSender : IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true, //bật bảo mật
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("taun696969@gmail.com", "oylftckhvdhkojrs")
            };

            return client.SendMailAsync(
                new MailMessage(from: "taun696969@gmail.com",
                                to: email,
                                subject,
                                message
                                ));
        }
    }
}
