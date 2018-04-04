using Microsoft.AspNetCore.Identity;
using System.Collections;
using System.Collections.Generic;

namespace SimpleDrive.DAL.Models
{
    public class User : IdentityUser<int>
    {
        public User()
            : base()
        {
            this.Files = new HashSet<File>();
        }

        // navigational property
        public virtual ICollection<File> Files { get; set; }
    }
}