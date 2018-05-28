using Newtonsoft.Json;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.IntegrationTests.Constants;
using SimpleDrive.IntegrationTests.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using Xunit;

namespace SimpleDrive.IntegrationTests.TestClasses
{
    public class FilesControllerTests : TestClassBase<TestClassFixtureBase>
    {
        public FilesControllerTests(TestClassFixtureBase classFixture) : base(classFixture)
        {
        }
        
        [Theory]
        [InlineData("public")]
        [InlineData("personal")]
        [InlineData("shared")]
        [InlineData("all")]
        public async void GetFilesEndpoints_Return_Nothing_When_Nothing_Is_Present(string endpoint)
        {
            // Arrange

            // Act
            var result = await _client.GetAsync($"api/files/{endpoint}");
            var data = JsonConvert.DeserializeObject<List<FileGridInfo>>(await result.Content.ReadAsStringAsync());

            // Assert
            Assert.True(result.IsSuccessStatusCode);
            Assert.False(data.Any());
        }

        [Fact]
        public async void Get_Returns_BadRequest_For_Missing_File()
        {
            // Arrange

            // Act
            var result = await _client.GetAsync("api/files/5");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }

        [Fact]
        public async void Share_Returns_BadRequest_For_Missing_File_Path()
        {
            // Arrange

            // Act
            var result = await _client.GetAsync("api/files/invalidPath/share?p=0");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }

        [Fact]
        public async void ShareLink_Returns_BadRequest_For_Missing_File_Path()
        {
            // Arrange

            // Act
            var result = await _client.GetAsync("api/files/5/shareLink?p=1");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }

        [Fact]
        public async void Sharing_Returns_BadRequest_For_Invalid_Model()
        {
            // Arrange
            var content = new StringContent(string.Empty, Encoding.UTF8, MimeTypes.AppJson);

            // Act
            var result = await _client.PostAsync("api/files/sharing", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }

        [Fact]
        public async void Post_Returns_Ok_For_Empty_List()
        {
            // Arrange
            var content = new StringContent(string.Empty, Encoding.UTF8, MimeTypes.AppJson);

            // Act
            var result = await _client.PostAsync("api/files", content);

            // Assert
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        }

        [Fact]
        public async void Post_Returns_Ok_For_One_File()
        {
            // Arrange
            var content = new MultipartFormDataContent()
            {
                { new StringContent("{ key: value }", Encoding.UTF8, MimeTypes.AppJson), "files", "test.json" }
            };

            // Act
            var result = await _client.PostAsync("api/files", content);

            // Assert
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        }

        [Fact]
        public async void Put_Returns_BadRequest_For_Missing_File()
        {
            // Arrange
            var content = new StringContent(string.Empty, Encoding.UTF8, MimeTypes.AppJson);

            // Act
            var result = await _client.PutAsync("api/files/5", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }

        [Fact]
        public async void Delete_Returns_BadRequest_For_Missing_File()
        {
            // Arrange

            // Act
            var result = await _client.DeleteAsync("api/files/5");

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }
    }
}
