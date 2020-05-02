using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    //[Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        // 10.4 Dodati Controller i u njega dodati konstruktor sa sljedecim inicijaliziranim propertijima ->PhotoForCreationDto
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;
            // dodati cloud name i ostale propertije
            Account acc = new Account
            (
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(acc);
        }
        // 11.5 ->IDatingRepository
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            // 11.5.3 nastaviti sa GetPhoto() -> PhotoForReturnDto
            var photoFromRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }


        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            // 11.4.2 Nastaviti rad na kontrolleru
            // uporediti userid sa root parametrom userid
            // provjera da li user koji pokusava da updejtuje profil odgovara tokenu koji server prima
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            //uzimanje usera iz repositorija
            var userFromRepo = await _repo.GetUser(userId, true);
            // spasavanje fajla
            var file = photoForCreationDto.File;
            // koristi se za spasavanje onoga sto se dobije iz cloudinerija
            var uploadResult = new ImageUploadResult();
            // porvjera dal nes ima u fajlu
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            // mapirati photoForCreationgDto u photo
            var photo = _mapper.Map<Photo>(photoForCreationDto);

            // ako je prva fotografija staviti je za main
            if (!userFromRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;
            userFromRepo.Photos.Add(photo);
            if (await _repo.SaveAll())
            {
                //11.5 Dodati CreatedAtRoute(); da bi vratio jednu photo
                // 11.5.6 Nastaviti sa createdAtRoute
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id}, photoToReturn);
            }
            return BadRequest("Fotografija se nije mogla dodati");
        }
        // 11.10 Setmain photo ->IDatingRepository
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            // uporediti userid sa root parametrom userid
            // provjera da li user koji pokusava da updejtuje profil odgovara tokenu koji server prima
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            // da li id odgovara idiju userovih fotografija
            var user = await _repo.GetUser(userId, true);
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo.IsMain)
                return BadRequest("Ovo je vec glavna fotografija");

            //11.10.3 nastaviti sa novom metodom
            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            // fotografiju koju smo uzeli stavljano da vise nije main photo jer hocemo drugu da stavimo
            currentMainPhoto.IsMain = false;
            // postavljanje nove fotografije kao main 
            photoFromRepo.IsMain = true;
            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest("Glavna fotografija se nije mogla postaviti");
        }

        //11.17 Dodati delete metod ->user.service
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            // uporediti userid sa root parametrom userid
            // provjera da li user koji pokusava da updejtuje profil odgovara tokenu koji server prima
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            // da li id odgovara idiju userovih fotografija
            var user = await _repo.GetUser(userId, true);
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo.IsMain)
                return BadRequest("ne mozes izbrisati glavnu fotografiju");

            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                    _repo.Delete(photoFromRepo);
            }

            if (photoFromRepo.PublicId == null)
            {
                _repo.Delete(photoFromRepo);
            }
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Niste uspjeli izbrisati fotografiju");
        }
    }
}