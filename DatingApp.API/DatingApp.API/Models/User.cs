using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Models
{
    // 3.3. dodati klasu User i propertije -> DataContext
    // 20.3 Dodati identity i izbrisati propertije koji nam ne trebaju -> Role.cs
    public class User : IdentityUser<int>
    {
        //public int Id { get; set; }
        //public string Username { get; set; }
        //public byte[] PasswordHash { get; set; }
        //public byte[] PasswordSalt { get; set; }
        // 8.2 Dodati nove propertije ->DataContext
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public ICollection<Photo> Photos { get; set; }

        // 15.3.1 Dodati Like u user classu ->DataContext
        public ICollection<Like> Likers { get; set; }
        public ICollection<Like> Likees { get; set; }
        // 16.2.1 Dodati kolekciju Message ->DataContext
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReveived { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }
    }
}
