using System.IO;
using System.Threading.Tasks;

namespace SimpleDrive.DAL.Interfaces
{
    public interface IFileService
    {
        Task AddUpdateAsync(string path, Stream stream);

        Task Remove(string path);

        string GenerateUniquePath();

        Stream OpenStream(string path);
    }
}
