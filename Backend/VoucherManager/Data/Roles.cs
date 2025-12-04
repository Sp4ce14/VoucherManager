using Microsoft.AspNetCore.Identity;

namespace VoucherManager.Data
{
    public class Roles
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            await SeedRolesAsync(serviceProvider.GetRequiredService<RoleManager<IdentityRole>>());
            await SeedAdminAsync(serviceProvider.GetRequiredService<UserManager<IdentityUser>>());
        }

        private static async Task SeedAdminAsync(UserManager<IdentityUser> _userManager)
        {
            var adminExists = await _userManager.FindByEmailAsync("admin@gmail.com");
            if (adminExists == null)
            {
                IdentityUser admin = new()
                {
                    UserName = "admin",
                    Email = "admin@gmail.com"
                };
                var result = await _userManager.CreateAsync(admin, "admin123!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(admin, "admin");
                }
            }
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> _roleManager)
        {
            string[] roles = { "user", "admin" };
            foreach (var role in roles)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
            
        }
    }
}
