using System;
using System.ComponentModel.DataAnnotations;

namespace SimpleDrive.DAL.Models
{
    public class File : EntityBase<int>
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Path { get; set; }
        
        public string ContentType { get; set; }
        
        public DateTime CreatedTimestamp { get; set; }

        public DateTime UpdatedTimestamp { get; set; }

        public int OwnerId { get; set; }

        public virtual User Owner { get; set; }
    }
}
