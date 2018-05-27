using Newtonsoft.Json;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.IntegrationTests.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace SimpleDrive.IntegrationTests.TestClasses
{
    public class FilesControllerTests : TestClassBase<TestClassFixtureBase>
    {
        public FilesControllerTests(TestClassFixtureBase classFixture) : base(classFixture)
        {
        }
        
        [Fact]
        public async void GetPersonal_Returns_Nothing_When_Nothing_Is_Present()
        {
            // Arrange

            // Act
            var result = await _client.GetAsync("api/files/personal");
            var data = JsonConvert.DeserializeObject<List<FileGridInfo>>(await result.Content.ReadAsStringAsync());

            // Assert
            Assert.True(result.IsSuccessStatusCode);
            Assert.False(data.Any());
        }
    }
}
