using SimpleDrive.DAL.Enumerations;

namespace SimpleDrive.DAL.Models
{
    public class ResourcePermission : EntityBase<int>
    {
       public int UserId { get; set; }

       public int FileId { get; set; }

       public Permissions PermissionId { get; set; }

       public virtual User User { get; set; }

       public virtual File File { get; set; }
    }
}
