using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;

namespace SimpleDrive.App.Extensions
{
    public static class FormFileExtensions
    {
        public static string GetFileName(this IFormFile file)
        {
            return ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        }
    }
}
