namespace SimpleDrive.App.DataTransferObjects
{
    public class QuotaChangeDTO
    {
        public int UserId { get; set; }

        public long? QuotaAllowed { get; set; }
    }
}
