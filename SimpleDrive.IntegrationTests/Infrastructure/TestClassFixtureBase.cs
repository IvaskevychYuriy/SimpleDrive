using SimpleDrive.IntegrationTests.TestFixtures;
using System;
using Xunit;

namespace SimpleDrive.IntegrationTests.Infrastructure
{
    /// <summary>
    ///     Is responsible for per-test-class TearUp and TearDown
    /// </summary>
    [Collection(InfrastructureConstants.GlobalCollectionName)]
    public class TestClassFixtureBase : IDisposable
    {
        public readonly TestCollectionFixture CollectionFixture;

        public TestClassFixtureBase(TestCollectionFixture collectionFixture)
        {
            CollectionFixture = collectionFixture;
        }

        public virtual void Dispose()
        {
        }
    }
}
