using System;

namespace DatingApp.API.Models
{
    // 8.2
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        // 8.4 Dodati propertije User i UserId radi definisanje veze izmedju entiteta ->UserSeedData.json
        // uraditi migracije i update database
        // add-migration ime
        // update-database
        // 11.3.4 Dodati novi property PublicId
        //20.23 Dodati properti, migraciju i update ->Seed.cs
        public bool IsApproved { get; set; }
        public string PublicId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
    }
}