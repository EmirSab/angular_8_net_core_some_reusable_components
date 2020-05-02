using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    // 14.4.2 Dodati class koje parametre user salje serveru da bi se paginacija mogla uraditi - IDatingRepository
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        // 14.8 Dodati propertije za filtere ->UsersController
        public int UserId { get; set; }
        public string Gender { get; set; }
        // 14.9 Dodti nove propertije
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 99;
        // 14.11 Dodatio properti za order ->DatingRepository
        public string OrderBy { get; set; }

        // 15.5 Dodati nove parametre ->DatingRepository
        public bool Likees { get; set; } = false;
        public bool Likers { get; set; } = false;
    }
}
