namespace AspnetApi.Dtos.Account
{
    public class AccountDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string NormalizedUserName { get; set; }
        public string Email { get; set; }
        public string NormalizedEmail { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public bool? Gender { get; set; }
        public string Avatar { get; set; }
        public DateTime CreatedAt { get; set; }
        public string RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
