namespace VoucherManager.Dtos
{
    public class AuthResult
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public string Error { get; set; }
    }
}
