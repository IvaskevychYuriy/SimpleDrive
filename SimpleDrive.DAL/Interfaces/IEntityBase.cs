namespace SimpleDrive.DAL.Interfaces
{
    public interface IEntityBase<T>
    {
        T Id { get; set; }
    }
}
