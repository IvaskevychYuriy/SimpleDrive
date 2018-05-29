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
            ResourcePermissions = new HashSet<ResourcePermission>();
        }

        public long? QuotaAllowed { get; set; }

        public string Location { get; set; }

        public int RegistrationYear { get; set; }

        public virtual ICollection<File> Files { get; set; }

        public virtual ICollection<ResourcePermission> ResourcePermissions { get; set; }
    }
}
