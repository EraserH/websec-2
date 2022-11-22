using NetTopologySuite.Features;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace ToSamaraApiServer.Crs
{
    public class OgcFeatureCollection : Collection<IFeature>
    {
        public OgcFeatureCollection()
            : base(new List<IFeature>())
        {
        }

        public List<Link> Links { get; set; }

        public long TotalMatched { get; set; }
    }
}
