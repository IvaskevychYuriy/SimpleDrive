using SimpleDrive.DAL.Interfaces;

namespace SimpleDrive.DAL.Models
{
    public class EntityBase<T> : IEntityBase<T>
    {
        public T Id { get; set; }
    }
}
