using SimpleDrive.IntegrationTests.Helpers;
using SimpleDrive.IntegrationTests.TestFixtures;

namespace SimpleDrive.IntegrationTests.Infrastructure
{
    public class TestClassFixtureNoAuth : TestClassFixtureBase
    {
        public TestClassFixtureNoAuth(TestCollectionFixture collectionFixture) 
            : base(collectionFixture)
        {
            CollectionFixture.Client.ClearCookies(true);
        }

        public override async void Dispose()
        {
            await CollectionFixture.Client.EnsureLoggedIn(true);
            base.Dispose();
        }
    }
}
