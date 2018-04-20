using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using SimpleDrive.DAL;
using System;
using System.Net.Http;
using Xunit;

namespace SimpleDrive.IntegrationTests.Infrastructure
{
    /// <summary>
    ///     Encapsulates needed services for test class
    ///     Is responsible for per-test TearUp and TearDown
    /// </summary>
    [Collection(InfrastructureConstants.GlobalCollectionName)]
    public class TestClassBase<T> : IClassFixture<T>, IDisposable
        where T : TestClassFixtureBase
    {
        private readonly IDbContextTransaction _transaction;

        protected readonly HttpClient _client;
        
        public TestClassBase(T classFixture)
        {
            _client = classFixture.CollectionFixture.Client;

            using (var scope = classFixture.CollectionFixture.ScopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetService<ApplicationDbContext>();
                _transaction = dbContext.Database.BeginTransaction();
            }
        }

        public virtual void Dispose()
        {
            if (_transaction != null)
            {
                _transaction.Rollback();
                _transaction.Dispose();
            }
        }
    }
}
