using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    // 20.5.1 Dodati
    [AllowAnonymous]
    // 3.9 Napraviti AuthController ->UserForRegisterDto
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //private readonly IAuthRepository _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public IConfiguration _config { get; }

        //20.8 Dodati usermanager i signinmanager
        public AuthController(IConfiguration config, IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _config = config;
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        // 3.10.1
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            // 20.9 Prepravka registera metoda ->Startup.cs
            //userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            //if (await _repo.UserExists(userForRegisterDto.Username))
                //return BadRequest("User vec postoji");
            var userToCreate = _mapper.Map<User>(userForRegisterDto);
            //20.9
            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);
            //var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);
            var userToReturn = _mapper.Map<UserForDetailedDto>(userToCreate);

            // 20.9
            if (result.Succeeded)
            {
                return CreatedAtRoute("GetUser", new { controller = "Users", id = userToCreate.Id }, userToReturn);
            }

            return BadRequest(result.Errors);
        }

        //3.13 Login metod ->UserForLoginDto ->WeatherController ->Startup.cs
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            // provjera dal user postoji
            //var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);
            // provjera dal ima usera
            //if (userFromRepo == null)
            //return Unauthorized();

            // 20.8
            var user = await _userManager.FindByNameAsync(userForLoginDto.Username);

            var result = await _signInManager
                 .CheckPasswordSignInAsync(user, userForLoginDto.Password, false);


            if (result.Succeeded)
            {
                var appUser = await _userManager.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(u => u.NormalizedUserName == userForLoginDto.Username.ToUpper());
                // dodavanje slike u navbar
                var userToReturn = _mapper.Map<UserForListDto>(appUser);

                return Ok(new
                {
                    // greska je bila jer na kraju nije bilo result
                    token = GenerateJwtToken(appUser).Result,
                    user = userToReturn
                });
            }
            return Unauthorized();
        }

        // 20.8 Dodati novi metod GenerateJwtToken()
        private async Task<string> GenerateJwtToken(User user)
        {
            //pravljenje tokena
            var claims = new List<Claim>
            {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName)
            };

            // 20.11 uzeti role za usera ->Startup.cs
            var roles = await _userManager.GetRolesAsync(user);

            // dodati rolu na claim
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            //key za signanje tokena
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            //generacija signing kredencijala
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            // generacija deskriptora
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(100),
                SigningCredentials = creds
            };

            //token handler
            var tokenHandler = new JwtSecurityTokenHandler();
            //kreiranje tokena i prosljedjivanje deskriptora
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}