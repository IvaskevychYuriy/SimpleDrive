using Microsoft.AspNetCore.Identity;
using SimpleDrive.DAL.Interfaces;

namespace SimpleDrive.DAL.Models
{
    public class Role : IdentityRole<int>, IEntityBase<int>
    {
        public Role()
        {
        }

        public Role(string roleName) : base(roleName)
        {
        }
    }
}