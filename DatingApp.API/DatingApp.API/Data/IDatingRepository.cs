using DatingApp.API.Helpers;
using DatingApp.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    // 8.7 Dodati interface ->DatingRepository
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        // 14.5 Dodati pagedList i UserParams ->DatingRepository
        Task<PagedList<User>> GetUsers(UserParams userParams); 
        Task<User> GetUser(int id, bool isCurrentUser);
        //11.5.1 Dodati GetPhoto() ->DatingRepository
        Task<Photo> GetPhoto(int id);
        // 11.10.1 Metod za dobavljanje glavne fotografije ->DatingRepository
        Task<Photo> GetMainPhotoForUser(int userId);

        // 15.4 Dodati GetLike() ->Datingepisotory
        Task<Like> GetLike(int userId, int recipientId);
        // 16.3 Dodati metode za poruke ->DatingRepository
        Task<Message> GetMessage(int id);
        // 16.5 Dodati MessageParams ->MessageParams
        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
    }
}
