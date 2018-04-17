using SimpleDrive.DAL.Enumerations;
using System.Collections.Generic;

namespace SimpleDrive.DAL.Models
{
    public class Permission : EntityBase<Permissions>
    {
        public Permission()
        {
            ResourcePermissions = new HashSet<ResourcePermission>();
        }

        public string Name { get; set; }

        public virtual ICollection<ResourcePermission> ResourcePermissions { get; set; }
    }
}
