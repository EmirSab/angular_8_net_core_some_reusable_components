using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    // 20.12.1 napraviti nekoliko placeholder metoda
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IOptions<CloudinarySettings> _clodinaryConfig;
        private Cloudinary _cloudinary;

        // 20.13 Vratiti roleName tako sto ce se joinati UserRole i User tabela
        //20.23.11 dodati clodinary i account 
        public AdminController(DataContext context, UserManager<User> userManager, IOptions<CloudinarySettings> clodinaryConfig)
        {
            _context = context;
            _userManager = userManager;
            _clodinaryConfig = clodinaryConfig;

            Account acc = new Account(
                    _clodinaryConfig.Value.CloudName,
                    _clodinaryConfig.Value.ApiKey,
                    _clodinaryConfig.Value.ApiSecret
                );
            _cloudinary = new Cloudinary(acc);
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var userList = await (from user in _context.Users
                                  orderby user.UserName
                                  select new
                                  {
                                      // objekat koji sadrzava propertije koji se vracaju iz querija
                                      Id = user.Id,
                                      UserName = user.UserName,
                                      Roles = (from userRole in user.UserRoles join role in _context.Roles on userRole.RoleId equals role.Id select role.Name).ToList()
                                  }).ToListAsync();
            return Ok(userList);
        }

        [Authorize(Policy = "RequireAdminRole")]
        // 20.14 Metod za editovanje rola ->RoleEditDto
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            //20.14.2
            //dohvacanje usera iz dba
            var user = await _userManager.FindByNameAsync(userName);
            // kojim rolama user pripada
            var userRoles = await _userManager.GetRolesAsync(user);
            //koje su role selektovane
            var selectedRoles = roleEditDto.RoleNames;
            // ako nema role
            // selectedRoles = selectedRoles != null ? selectedRoles : new string[] {}
            // ako je null koristi ljevo nije nulla koristi to ako je null koristi desno sto je od ??
            selectedRoles = selectedRoles ?? new string[] { };

            //dodati usera selektovanim rolama
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Usera nije moguce dodati roli");

            // ukloniti koje su deselektovane sa liste
            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!result.Succeeded)
                return BadRequest("Role nisu uklonjenje");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        // 20.23.11 Prepraviti metod
        // ignore se stavlja jer zelimo da dobijemo photos koje su false
        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public async Task<IActionResult> GetPhotosForModeration()
        {
            var photos = await _context.Photos
                .Include(u => u.User)
                .IgnoreQueryFilters()
                .Where(p => p.IsApproved == false)
                .Select(u => new
                {
                    Id = u.Id,
                    UserName = u.User.UserName,
                    Url = u.Url,
                    IsApproved = u.IsApproved
                }).ToListAsync();

            return Ok(photos);
        }

        // 20.23.11 Dodati i approvePhoto
        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("approvePhoto/{photoId}")]
        public async Task<IActionResult> ApprovePhoto(int photoId)
        {
            var photo = await _context.Photos
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == photoId);

            photo.IsApproved = true;

            await _context.SaveChangesAsync();

            return Ok();
        }

        //20.23.11 Dodati RejectPhoto()
        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("rejectPhoto/{photoId}")]
        public async Task<IActionResult> RejectPhoto(int photoId)
        {
            var photo = await _context.Photos
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == photoId);

            if (photo.IsMain)
                return BadRequest("You cannot reject the main photo");

            if (photo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                {
                    _context.Photos.Remove(photo);
                }
            }

            if (photo.PublicId == null)
            {
                _context.Photos.Remove(photo);
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}