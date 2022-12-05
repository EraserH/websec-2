namespace ToSamaraApiServer.Auxiliary
{
    public class RouteToSerialize
    {
        public RouteToSerialize(int kR_ID, string number, string direction, int transportTypeID,
            string transportType, int affiliationID, string affiliation, int realtimeForecast)
        {
            this.KR_ID = kR_ID;
            this.number = number;
            this.direction = direction;
            this.transportTypeID = transportTypeID;
            this.transportType = transportType;
            this.affiliationID = affiliationID;
            this.affiliation = affiliation;
            this.realtimeForecast = realtimeForecast;
        }
        public int KR_ID { get; set; }
        public string number { get; set; }
        public string direction { get; set; }
        public int transportTypeID { get; set; }
        public string transportType { get; set; }
        public int affiliationID { get; set; }
        public string affiliation { get; set; }
        public int realtimeForecast { get; set; }
    }
}