using Microsoft.AspNetCore.Mvc;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using System.Xml.Serialization;
using ToSamaraApiServer.DeserializeClasses;
using ToSamaraApiServer.Auxiliary;

namespace ToSamaraApiServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StopsController : ControllerBase
{
    [HttpGet(Name = "GetStopsGeoJson")]
    public async Task<ActionResult<FeatureCollection>> Get()
    {
        var xmlSerializer = new XmlSerializer(typeof(stops));
        var httpClient = new HttpClient();
        var stopsStream = await httpClient.GetStreamAsync("https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml");
        var Deserializedstops = xmlSerializer.Deserialize(stopsStream) as stops;
        //var Deserializedstops = await StreamGetter.GetStops();
        var featureCollection = new FeatureCollection();
        if (Deserializedstops != null)
        {
            foreach (var stop in Deserializedstops.stop)
            {

                featureCollection.Add(new Feature
                {
                    Geometry = new Point((double)stop.longitude, (double)stop.latitude),
                    Attributes = new AttributesTable(new Dictionary<string, object>()
                    {
                        ["KS_ID"] = stop.KS_ID,
                        ["title"] = stop.title,
                        ["adjacentStreet"] = stop.adjacentStreet,
                        ["direction"] = stop.direction,
                        ["busesMunicipal"] = stop.busesMunicipal,
                        ["busesCommercial"] = stop.busesCommercial,
                        ["busesPrigorod"] = stop.busesPrigorod,
                        ["busesSeason"] = stop.busesSeason,
                        ["busesSpecial"] = stop.busesSpecial,
                        ["trams"] = stop.trams,
                        ["trolleybuses"] = stop.trolleybuses,
                        ["metros"] = stop.metros
                    })
                });
            }

            featureCollection.TransformCoords();
            return Ok(featureCollection);
        }
        else
        {
            return NoContent();
        }
    }
}