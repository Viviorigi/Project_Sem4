using System.Net;
using System.Net.Mail;

namespace AspnetApi.Services.Email
{
    public class EmailSender : IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string messageHtml)
        {
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("taun696969@gmail.com", "oylftckhvdhkojrs")
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("taun696969@gmail.com", "PhoneStore Team"),
                Subject = subject,
                Body = messageHtml,
                IsBodyHtml = true // 🔥 Cho phép HTML
            };

            mailMessage.To.Add(email);

            return client.SendMailAsync(mailMessage);
        }
    }
}
