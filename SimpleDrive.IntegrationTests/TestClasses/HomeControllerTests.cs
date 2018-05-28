using Newtonsoft.Json;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.IntegrationTests.Constants;
using SimpleDrive.IntegrationTests.Infrastructure;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace SimpleDrive.IntegrationTests.TestClasses
{
    public class HomeControllerTests : TestClassBase<TestClassFixtureNoAuth>
    {
        public HomeControllerTests(TestClassFixtureNoAuth classFixture) : base(classFixture)
        {
        }

        [Fact]
        public async void Login_Returns_BadRequest_On_Invalid_Model()
        {
            // Arrange
            var content = new StringContent(string.Empty, Encoding.UTF8, MimeTypes.AppJson);

            // Act
            var result = await _client.PostAsync("api/home/login", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }

        [Fact]
        public async void Login_Returns_Ok_On_Valid_Model()
        {
            // Arrange

            // Act
            var result = await LogIn("admin@gmail.com", "admin");

            // Assert
            Assert.True(result.IsSuccessStatusCode);
        }

        private async Task<HttpResponseMessage> LogIn(string email, string password)
        {
            var data = new LoginInfoDTO()
            {
                Email = email,
                Password = password,
            };

            var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, MimeTypes.AppJson);
            return await _client.PostAsync("api/home/login", content);
        }
    }
}
