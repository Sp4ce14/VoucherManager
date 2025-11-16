using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using VoucherManager.Data;
using VoucherManager.Dtos;
using VoucherManager.Models;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace VoucherManager.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthRepository(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            AppDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }
        public async Task<AuthResult> SignUpAsync(SignUpDto signUpDto)
        {
            var user = new IdentityUser()
            {
                UserName = signUpDto.UserName,
                Email = signUpDto.Email,
            };
            await _userManager.CreateAsync(user, signUpDto.Password);
            var info = await CreateTokenAsync(user);
            return info;
        }

        public async Task<AuthResult> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user == null)
            {
                return new AuthResult()
                {
                    Error = "User Not Found, Please Sign Up"
                };
            }
            var signIn = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!signIn.Succeeded)
            {
                return new AuthResult()
                {
                    Error = "Failed"
                };
            }
            var info = await CreateTokenAsync(user);
            return info;
        }

        private async Task<AuthResult> CreateTokenAsync(IdentityUser user)
        {
            var jti = Guid.NewGuid().ToString();
            var authClaims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, jti)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(authClaims),
                Expires = DateTime.UtcNow.AddMinutes(15),
                IssuedAt = DateTime.UtcNow,
                Issuer = _configuration["JWT:Issuer"],
                Audience = _configuration["JWT:Audience"],
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512)
            };
            var token = new JsonWebTokenHandler().CreateToken(tokenDescriptor);
            var refreshToken = new RefreshToken()
            {
                DateAdded = DateTime.UtcNow,
                DateExpire = DateTime.UtcNow.AddDays(15),
                Token = Guid.NewGuid().ToString() + "-" + Guid.NewGuid().ToString(),
                JwtId = jti,
                UserId = user.Id
            };
            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();
            return new AuthResult()
            {
                Token = token,
                RefreshToken = refreshToken.Token
            };
        }
    }
}
