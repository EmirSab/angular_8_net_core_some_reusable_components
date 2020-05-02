using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Dtos
{
    // 8.11 Dodati dto i peopertije - UserForDetailedDto
    public class PhotosForDetailedDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        // 20.23.3 Dodati IsApproved property ->Photo.ts
        public bool IsApproved { get; set; }
    }
}
