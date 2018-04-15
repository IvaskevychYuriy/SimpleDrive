using Microsoft.AspNetCore.Identity;
using SimpleDrive.DAL.Interfaces;
using System.Collections.Generic;

namespace SimpleDrive.DAL.Models
{
    public class User : IdentityUser<int>, IEntityBase<int>
    {
        public User() : base()
        {
            Init();
        }

        public User(string userName) : base(userName)
        {
            Init();
        }

        private void Init()
        {
            Files = new HashSet<File>();
        }

        public virtual ICollection<File> Files { get; set; }
    }
}