using ProjNet;
using ToSamaraApiServer.Crs;
using NetTopologySuite.Features;

namespace ToSamaraApiServer.Auxiliary
{
    public static class CoordinatesTransform
    {
        //public static void TransformCoords(this FeatureCollection featureCollection, (double longitude, double latitude) coords)
        public static void TransformCoords(this FeatureCollection featureCollection)
        {
            /*var transform = new
                ProjNet.CoordinateSystems.Transformations.CoordinateTransformationFactory().CreateFromCoordinateSystems(
                    ProjNet.CoordinateSystems.GeographicCoordinateSystem.WGS84,
                    ProjNet.CoordinateSystems.ProjectedCoordinateSystem.WebMercator);*/
            //var transformedFeatureCollection = new FeatureCollection();
            
            for (int i = 0; i < featureCollection.Count; i++)
            {
                featureCollection[i].Transform(ProjNet.CoordinateSystems.GeographicCoordinateSystem.WGS84,
                    ProjNet.CoordinateSystems.ProjectedCoordinateSystem.WebMercator);
            }
        }
    }
}
