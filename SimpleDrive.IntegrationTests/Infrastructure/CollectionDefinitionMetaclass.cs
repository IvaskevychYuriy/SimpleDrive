using SimpleDrive.IntegrationTests.TestFixtures;
using Xunit;

namespace SimpleDrive.IntegrationTests.Infrastructure
{
    /// <summary>
    ///     This class is left blank on purpose
    ///     It just hold a collection metadata for test classes
    /// </summary>
    [CollectionDefinition(InfrastructureConstants.GlobalCollectionName)]
    public class CollectionDefinitionMetaclass : ICollectionFixture<TestCollectionFixture>
    {
    }
}
