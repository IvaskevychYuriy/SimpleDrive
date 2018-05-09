using System.Collections.Generic;

namespace SimpleDrive.App.DataTransferObjects
{
    public class UserProfileDTO
    {
        public string Email { get; set; }

        public string UserName { get; set; }

        public IList<string> Roles {get; set; }
    }
}
