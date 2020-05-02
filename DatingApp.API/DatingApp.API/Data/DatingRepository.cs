using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    //8.7.1 Implementirati interface ->Startup.cs
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        //11.5.2 Implementovati GetPhoto()->PhotoController
        // 20.23.10 DOdati ignorequery filters
        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        //20.23.8 Provjera da li je taj user user ->UsersController
        public async Task<User> GetUser(int id, bool isCurrentUser)
        {
            var query = _context.Users.Include(p => p.Photos).AsQueryable();
            if (isCurrentUser)
                query = query.IgnoreQueryFilters();
            //var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);

            var user = await query.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        // 14.5.1 Prepraviti metod u implementaciji ->UsersController
        // 14.8.2 Dodati dio za filtere
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            // 14.11
            var users =  _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);

            //15.5.1 Dodati nove propertije ->DatingRepository
            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            // 14.9.1 Dodati filtere za godine ->app.module.ts
            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge - 1);
                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            // 14.11.1
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }
        // 15.5.1
        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users.Include(x => x.Likers).Include(x => x.Likees).FirstOrDefaultAsync(u => u.Id == id);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }
        // 11.10.2 Implementacija GetMainPhoto ->photosController
        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() >= 0;
        }

        // 15.4.1 Dodati novi metod ->UsersController
        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        // 16.5.2 Implementovati MEssageParams u GEtMEssageForUser ->MessagesToReturnDto
        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos).Include(u => u.Recipient).ThenInclude(p => p.Photos).AsQueryable();

            switch (messageParams.MessageContainer)
            {
                // 16.15.1 Dodati dio u donji dio za brisanje
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId &&u.RecipientDeleted == false && u.IsRead == false);
                    break;
            }
            messages = messages.OrderByDescending(d => d.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        // 16.7 Napraviti metod ->MessagesController
        // 16.15.1 Dodati dio && m.RecipientDeleted == false i m.SenderDeleted == false ->us er.service
        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                    .Include(u => u.Sender).ThenInclude(p => p.Photos).Include(u => u.Recipient).ThenInclude(p => p.Photos).Where(m => m.RecipientId == userId && m.RecipientDeleted == false && m.SenderId == recipientId || m.RecipientId == recipientId && m.SenderId == userId && m.SenderDeleted == false).OrderByDescending(m => m.MessageSent).ToListAsync();
            return messages;
        }
    }
}
