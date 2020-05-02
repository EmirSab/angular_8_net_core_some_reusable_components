using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    // 8.10.2 Izmapirati dto i modele ->PhotosForDetailedDto
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>().ForMember(dest => dest.PhotoUrl, opt => {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            }).ForMember(dest => dest.Age, opt => {
                opt.MapFrom(d => d.DateOfBirth.CalculateAge());
            });
            CreateMap<User, UserForDetailedDto>().ForMember(dest => dest.PhotoUrl, opt => {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            }).ForMember(dest => dest.Age, opt => {
                opt.MapFrom(d => d.DateOfBirth.CalculateAge());
            });
            // 8.11.2 dodati novo mapiranje ->Extencions.cs
            CreateMap<Photo, PhotosForDetailedDto>();
            // 10.6.1 Dodati mapiranje za updejt usera ->UsersController
            CreateMap<UserForUpdateDto, User>();
            // 11.5.5 Dodati mapiranje ->PhotosController
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            //12.9.1 izmapirati ->AuthController
            CreateMap<UserForRegisterDto, User>();

            // 16.4.3 izmapirati novi dto ->MessagesController
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            // 16.6.1 Dodadi novo mapiranje ->MessagesController
            CreateMap<Message, MessageToReturnDto>().ForMember(m => m.SenderPhotoUrl, opt => opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(m => m.RecipientPhotoUrl, opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}
