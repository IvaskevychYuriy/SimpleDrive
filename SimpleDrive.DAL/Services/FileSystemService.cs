using SimpleDrive.DAL.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SimpleDrive.DAL.Services
{
    public class FileSystemService : IFileService
    {
        public async Task AddUpdateAsync(string path, Stream stream)
        {
            string folderPath = Path.GetDirectoryName(path);
            Directory.CreateDirectory(folderPath);

            using (var fs = File.Open(path, FileMode.Create))
            {
                await stream.CopyToAsync(fs);
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
            return Guid.NewGuid().ToString();
        }
    }
}
