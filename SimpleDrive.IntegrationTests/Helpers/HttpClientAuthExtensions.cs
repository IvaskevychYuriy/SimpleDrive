using Newtonsoft.Json;
using SimpleDrive.App.DataTransferObjects;
using SimpleDrive.IntegrationTests.Constants;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SimpleDrive.IntegrationTests.Helpers
{
    public static class HttpClientAuthExtensions
    {
        private const string SetCookieHeaderName = "Set-Cookie";
        private const string CookieHeaderName = "Cookie";

        public static async Task EnsureLoggedIn(this HttpClient client, LoginInfoDTO data)
        {
            client = client ?? throw new ArgumentNullException(nameof(client));
            
            var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, MimeTypes.AppJson);
            var result = await client.PostAsync("api/home/login", content);
            result.EnsureSuccessStatusCode();

            var cookie = result.Headers.GetValues(SetCookieHeaderName);
            client.ClearCookies();
            client.DefaultRequestHeaders.Add(CookieHeaderName, cookie);
        }

        public static async Task EnsureLoggedIn(this HttpClient client, bool restoreCurrentSettings = false)
        {
            var data = new LoginInfoDTO()
            {
                Email = "admin@gmail.com",
                Password = "admin",
            };

            if (restoreCurrentSettings)
            {
                client.ClearCookies();
                client.DefaultRequestHeaders.Add(CookieHeaderName, CurrentSettings);
            }
            else
            {
                await client.EnsureLoggedIn(data);
            }
        }

        public static void ClearCookies(this HttpClient client, bool rememberCurrentSettings = false)
        {
            client = client ?? throw new ArgumentNullException(nameof(client));

            if (client.DefaultRequestHeaders.Contains(CookieHeaderName))
            {
                if (rememberCurrentSettings)
                {
                    CurrentSettings = client.DefaultRequestHeaders.GetValues(CookieHeaderName);
                }

                client.DefaultRequestHeaders.Remove(CookieHeaderName);
            }
        }

        private static IEnumerable<string> CurrentSettings { get; set; }
    }
}
