﻿using SimpleDrive.DAL.Enumerations;
using System;
using System.Collections.Generic;
using System.Text;

namespace SimpleDrive.DAL.Models
{
    public class ResourcePermission : EntityBase<int>
    {
       public int UserId { get; set; }
       public int FileId { get; set; }
       public Permissions PermissionId { get; set; }
       public virtual User User { get; set; }
       public virtual Permission Permission { get; set; }
       public virtual File File { get; set; }
    }
}
