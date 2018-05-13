using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SimpleDrive.DAL.Models
{
    public class File : EntityBase<int>
    {
        public File()
        {
            ResourcePermissions = new HashSet<ResourcePermission>();
        }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Path { get; set; }

        public long Length { get; set; }

        public string ContentType { get; set; }

        public DateTime CreatedTimestamp { get; set; }

        public DateTime UpdatedTimestamp { get; set; }

        public int OwnerId { get; set; }
        
        [DefaultValue(false)]
        public bool IsPubliclyVisible { get; set; }

        public virtual User Owner { get; set; }

        public virtual ICollection<ResourcePermission> ResourcePermissions { get; set; }
    }
}
