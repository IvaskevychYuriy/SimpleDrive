using SimpleDrive.DAL.Enumerations;
using System;
using System.Collections.Generic;
using System.Text;

namespace SimpleDrive.DAL.Models
{
    public class Permission : EntityBase<Permissions>
    {
        public string Name { get; set; }

        public virtual ICollection<ResourcePermission> ResourcePermissions { get; set; }

    }
}
