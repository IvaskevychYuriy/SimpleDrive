using Microsoft.AspNetCore.Identity;

namespace SimpleDrive.DAL.Models
{
    public class Role : IdentityRole<int>
    {
        public Role()
        {
        }

        public Role(string roleName) : base(roleName)
        {
        }
    }
}