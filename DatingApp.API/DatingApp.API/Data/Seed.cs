using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    // 8.6 Napraviti sleed clasu i metod za seedanje ->Startup.cs
    public class Seed
    {
        // 20.10 Dodati role userima, dodati ROleManager
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        // 20.7 Prepraviti seed metod
        //private readonly DataContext _context;

        public Seed(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            //_context = context;
        }
        public void SeedUsers()
        {
            if (!_userManager.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);

                //20.10 Dodati role u db
                var roles = new List<Role>
                { 
                    new Role{Name = "Member" },
                    new Role{Name = "Admin" },
                    new Role{Name = "Moderator" },
                    new Role{ Name = "VIP" }
                };
                foreach (var role in roles)
                {
                    _roleManager.CreateAsync(role).Wait();
                }

                foreach (var user in users)
                {
                    // 20.23.1 Dodati dio u seed fotografije koje seedamo su approved one koje dodajemo nisu ->PhotoForDetailDto
                    user.Photos.SingleOrDefault().IsApproved = true;
                    //20.7
                    _userManager.CreateAsync(user, "password").Wait();
                    //20.10 dodati usere rolama
                    _userManager.AddToRoleAsync(user, "Member").Wait();
                    //byte[] passwordHash, passwordSalt;
                    //CreatePasswordHash("password", out passwordHash, out passwordSalt);
                    //user.PasswordHash = passwordHash;
                    //user.PasswordSalt = passwordSalt;
                    //user.UserName = user.UserName.ToLower();
                    //_context.Users.Add(user);
                }
                //20.10 dodati admina
                var adminUser = new User
                { 
                    UserName = "Admin"
                };
                IdentityResult result = _userManager.CreateAsync(adminUser, "password").Result;

                if (result.Succeeded)
                {
                    var admin = _userManager.FindByNameAsync("Admin").Result;
                    _userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" }).Wait();
                }

                //_context.SaveChanges();
            }
        }
        /*private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }*/
    }
}
