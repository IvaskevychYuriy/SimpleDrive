using SimpleDrive.IntegrationTests.Infrastructure;
using System.Net;
using System.Net.Http;
using System.Text;
using Xunit;

namespace SimpleDrive.IntegrationTests.TestClasses
{
    public class HomeControllerTests : TestClassBase<TestClassFixtureBase>
    {
        public HomeControllerTests(TestClassFixtureBase classFixture) : base(classFixture)
        {
        }

        [Fact]
        public async void Login_Returns_BadRequest_On_Invalid_Model()
        {
            // Arrange
            var content = new StringContent(string.Empty, Encoding.UTF8, "application/json");

            // Act
            var result = await _client.PostAsync("api/home/login", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }
    }
}
