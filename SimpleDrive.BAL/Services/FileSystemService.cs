using SimpleDrive.BAL.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SimpleDrive.BAL.Services
{
    public class FileSystemService : IFileService
    {
        public async Task AddUpdateAsync(Models.FileInfo fileData)
        {
            using (var fs = File.Open(fileData.Path, FileMode.Create))
            {
                await fs.WriteAsync(fileData.Data, 0, fileData.Data.Length);
            }
        }
        
        public async Task Remove(string path)
        {
            // TODO: add waiter
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }

        public string GenerateUniquePath()
        {
            return new Guid().ToString();
        }
    }
}
