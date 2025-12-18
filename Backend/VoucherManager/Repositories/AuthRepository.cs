using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
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
        private readonly TokenValidationParameters _tokenValidParams;

        public AuthRepository(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            AppDbContext context,
            IConfiguration configuration,
            TokenValidationParameters tokenValidParams)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _tokenValidParams = tokenValidParams;
        }
        public async Task<AuthResult> SignUpAsync(SignUpDto signUpDto)
        {
            var user = new IdentityUser()
            {
                UserName = signUpDto.UserName,
                Email = signUpDto.Email,
            };
            var result = await _userManager.CreateAsync(user, signUpDto.Password);
            if (!result.Succeeded)
            {
                string err = "";
                foreach(var error in result.Errors)
                {
                    err = err + error.Description;
                }
                return new()
                {
                    Error = err
                };
            }
            await _userManager.AddToRoleAsync(user, "user");
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
                    Error = "Invalid Password"
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
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(authClaims),
                Expires = DateTime.UtcNow.AddSeconds(10),
                IssuedAt = DateTime.UtcNow,
                Issuer = _configuration["JWT:Issuer"],
                Audience = _configuration["JWT:Audience"],
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenObj = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(tokenObj);
            var refreshToken = new RefreshToken()
            {
                DateAdded = DateTimeOffset.UtcNow,
                DateExpire = DateTimeOffset.UtcNow.AddDays(15),
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
        public async Task<AuthResult> TokenRefresh(RefreshReqDto req)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenValid = await tokenHandler.ValidateTokenAsync(req.Token, _tokenValidParams);
            if (tokenValid.Exception is SecurityTokenExpiredException)
            {
                var token = tokenHandler.ReadJwtToken(req.Token);
                var jti = token.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
                var refreshTokenExists = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == req.RefreshToken);
                if (refreshTokenExists == null || refreshTokenExists.IsRevoked || refreshTokenExists.JwtId != jti || refreshTokenExists.DateExpire < DateTime.UtcNow)
                { 
                    return new()
                    {
                        Error = "Invalid Refresh Token"
                    };
                }
                refreshTokenExists.IsRevoked = true;
                await _context.SaveChangesAsync();
                var userId = token.Claims.FirstOrDefault(x => x.Type == "nameid")?.Value;
                var user = await _userManager.FindByIdAsync(userId);
                var info = await CreateTokenAsync(user);
                return info;
            }
            return new()
            {
                Error = "Access Token Invalid or not expired"
            };
        }
    }
}
