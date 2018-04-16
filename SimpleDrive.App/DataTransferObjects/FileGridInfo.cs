using System;

namespace SimpleDrive.App.DataTransferObjects
{
    public class FileGridInfo
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Path { get; set; }

        public string ContentType { get; set; }

        public string OwnerName { get; set; }

        public DateTime CreatedTimestamp { get; set; }

        public DateTime UpdatedTimestamp { get; set; }
    }
}
