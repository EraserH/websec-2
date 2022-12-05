using Microsoft.AspNetCore.Mvc;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using System.Xml.Serialization;
using ToSamaraApiServer.DeserializeClasses; // надо убрать это пространство имён или добавить у stops
using System.Text.Json;
using ToSamaraApiServer.Auxiliary;

namespace ToSamaraApiServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutesController : ControllerBase
    {
        [HttpGet(Name = "GetRoutesJson")]
        public async Task<ActionResult<FeatureCollection>> Get()
        {
            var xmlSerializer = new XmlSerializer(typeof(routes));
            var httpClient = new HttpClient();
            var routesStream = await httpClient.GetStreamAsync("https://tosamara.ru/api/v2/classifiers/routes.xml");
            var deserializedRoutes = xmlSerializer.Deserialize(routesStream) as routes;
            //var deserializedRoutes = await StreamGetter.GetRoutes();
            var routesColletion = new List<RouteToSerialize>();
            if (deserializedRoutes != null)
            {
                foreach (var r in deserializedRoutes.route)
                {
                    var routeToSerialize = new RouteToSerialize(r.KR_ID, r.number, r.direction,
                        r.transportTypeID, r.transportType, r.affiliationID, r.affiliation, r.realtimeForecast);
                    routesColletion.Add(routeToSerialize);
                }

                return Ok(routesColletion);
            }
            else
            {
                return NoContent();
            }
        }
    }
}