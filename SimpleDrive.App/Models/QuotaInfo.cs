namespace SimpleDrive.App.Models
{
    public class QuotaInfo
    {
        public long? QuotaAllowed { get; set; }

        public long QuotaUsed { get; set; }

        public long? Difference(long? additional = null) => QuotaAllowed - (QuotaUsed + (additional ?? 0));

        public bool IsExceeded(long? additional = null) => Difference(additional) < 0;
    }
}
