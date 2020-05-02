using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Data
{
    // 2.6.1 dodati Data folder i u njemu DataContext ->Startup.cs
    //20.4 Mjesto DbContext staviti IdentityDbContext ->Startup.cs
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        public DbSet<Value> Values { get; set; }
        // 3.3.1 dodati user clasu, posle uraditi migracije i update database
        //public DbSet<User> Users { get; set; }

        // 8.2.1 Dodati Photo -> Photo.cs
        public DbSet<Photo> Photos { get; set; }
        // 15.3.2 Dodati Like u context i prepraviti onmodel creating da bi se osigurala many to many veza ->IDatingRepository
        // posle ovog migracije i update db
        public DbSet<Like> Likes { get; set; }

        //16.2.2. Dodati Messages ->IDatingRepository
        public DbSet<Message> Messages { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            //20.4
            base.OnModelCreating(builder);
            builder.Entity<UserRole>(userRole => {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

                userRole.HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
            });

            builder.Entity<Like>()
                .HasKey(k => new { k.LikerId, k.LikeeId});

            builder.Entity<Like>()
                .HasOne(u => u.Likee)
                .WithMany(u => u.Likers)
                .HasForeignKey(u => u.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>()
                .HasOne(u => u.Liker)
                .WithMany(u => u.Likees)
                .HasForeignKey(u => u.LikerId)
                .OnDelete(DeleteBehavior.Restrict);
            //16.2.2
            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReveived)
                .OnDelete(DeleteBehavior.Restrict);

            //20.23.7
            builder.Entity<Photo>().HasQueryFilter(p => p.IsApproved);
        }
    }
}
