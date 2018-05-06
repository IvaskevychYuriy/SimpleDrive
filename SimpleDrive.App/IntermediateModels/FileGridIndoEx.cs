using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.DAL.Models;
using System.Collections.Generic;

namespace SimpleDrive.App.IntermediateModels
{
    public class FileGridInfoEx : FileGridInfo
    {
        public ICollection<ResourcePermission> ResourcePermissions { get; set; }
    }
}
