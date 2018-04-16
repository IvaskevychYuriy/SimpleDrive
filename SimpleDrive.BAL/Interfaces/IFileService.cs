using SimpleDrive.BAL.Models;
using System.Threading.Tasks;

namespace SimpleDrive.BAL.Interfaces
{
    public interface IFileService
    {
        Task AddUpdateAsync(FileInfo fileData);

        Task Remove(string path);

        string GenerateUniquePath();
    }
}
