using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SimpleDrive.DAL.Models
{
    public class File
    {
        // primary key
        [Key]
        public int Id { get; set; }

        // field
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        // foreign key
        public int OwnerId { get; set; }

        // navigational property
        public virtual User Owner { get; set; }
    }
}
