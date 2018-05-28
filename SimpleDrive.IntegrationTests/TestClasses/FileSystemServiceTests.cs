namespace SimpleDrive.IntegrationTests.TestClasses
{
    using SimpleDrive.DAL.Services;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using Xunit;

    public class FileSystemServiceTests
    {
        [Fact]
        public void GenerateUniquePath_Returns_Unique_String()
        {
            // Arrange
            FileSystemService service = new FileSystemService();
            var set = new HashSet<string>();

            for (int i = 0; i < 1000; ++i)
            {
                // Act
                string unique = service.GenerateUniquePath();

                // Assert
                Assert.DoesNotContain(unique, set);
                set.Add(unique);
            }
        }

        [Fact]
        public async Task AddUpdateAsync_Existing_File_Works()
        {
            // Arrange
            const string Content = "Hello, world!";
            string filePath = Path.GetTempFileName();

            Assert.True(File.Exists(filePath), "temporary file was not created");

            try
            {
                FileSystemService service = new FileSystemService();
                // Act
                var stream = new MemoryStream(Encoding.UTF8.GetBytes(Content));
                await service.AddUpdateAsync(filePath, stream);

                // Assert
                var savedContent = File.ReadAllText(filePath);
                Assert.Equal(Content, savedContent);
            }
            finally
            {
                File.Delete(filePath);
            }
        }

        [Fact]
        public async Task AddUpdateAsync_New_File_Works()
        {
            // Arrange
            const string Content = "Hello, world!";
            string filePath = Path.GetTempFileName();
            File.Delete(filePath);

            Assert.False(File.Exists(filePath), "temporary still exists");

            try
            {
                FileSystemService service = new FileSystemService();
                // Act
                var stream = new MemoryStream(Encoding.UTF8.GetBytes(Content));
                await service.AddUpdateAsync(filePath, stream);

                // Assert
                var savedContent = File.ReadAllText(filePath);
                Assert.Equal(Content, savedContent);
            }
            finally
            {
                File.Delete(filePath);
            }
        }

        [Fact]
        public void Open_Stream_Works()
        {
            // Arrange
            const string Content = "Hello, world!";
            string filePath = Path.GetTempFileName();
            File.WriteAllText(filePath, Content);

            FileSystemService service = new FileSystemService();

            // Act
            StreamReader reader = null;
            try
            {
                reader = new StreamReader(service.OpenStream(filePath));
                var savedContent = reader.ReadToEnd();
                // Assert
                Assert.Equal(Content, savedContent);
            }
            finally
            {
                reader?.Dispose();
                File.Delete(filePath);
            }
        }

        [Fact]
        public void Open_Not_Existing_Throws()
        {
            // Arrange
            string filePath = Path.GetTempFileName();
            File.Delete(filePath);

            Assert.False(File.Exists(filePath), "temporary still exists");

            FileSystemService service = new FileSystemService();

            // Act & Assert
            Assert.ThrowsAny<Exception>(() => service.OpenStream(filePath));
        }
    }
}