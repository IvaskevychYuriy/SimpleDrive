﻿namespace SimpleDrive.App.DataTransferObjects
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string Location { get; set; }

        public long? QuotaAllowed { get; set; }
    }
}
