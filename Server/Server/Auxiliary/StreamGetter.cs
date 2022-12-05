using System.Xml.Serialization;
using ToSamaraApiServer.DeserializeClasses;


namespace ToSamaraApiServer.Auxiliary
{
    public static class StreamGetter
    {
        private static double? lastLoadedStopsUpdate = null;
        private static double? lastLoadedRoutesUpdate = null;
        //private static bool NeedToUpdateStops { get; set; } = false;
        //private static bool NeedToUpdateRoutes { get; set; } = false;
        private static async Task Update()
        {
            var xmlSerializer = new XmlSerializer(typeof(classifiers));
            var httpClient = new HttpClient();
            var updatesStream = await httpClient.GetStreamAsync("https://tosamara.ru/api/v2/classifiers");
            var DeserializedUpdates = xmlSerializer.Deserialize(updatesStream) as classifiers;

            foreach (var update in DeserializedUpdates.file)
            {
                if (update.name == "stopsFullDB.xml")
                {
                    if (lastLoadedStopsUpdate == null || Convert.ToDouble(update.modified) > lastLoadedStopsUpdate)
                    {
                        lastLoadedStopsUpdate = Convert.ToDouble(update.modified);

                        var stopsStream = await httpClient.GetStreamAsync("https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml");

                        ReWriteXmls(stopsStream, "./Storages/newStops.xml", "./Storages/stopsFullDB.xml");
                    }
                }
                else if (update.name == "routes.xml")
                {
                    if (lastLoadedRoutesUpdate == null || Convert.ToDouble(update.modified) > lastLoadedRoutesUpdate)
                    {
                        lastLoadedRoutesUpdate = Convert.ToDouble(update.modified);

                        using var routesStream = await httpClient.GetStreamAsync("https://tosamara.ru/api/v2/classifiers/routes.xml");

                        ReWriteXmls(routesStream, "./Storages/newRoutes.xml", "./Storages/routes.xml");
                    }
                }
            }
        }

        private static async Task ReWriteXmls(Stream UpdatedStream, string filler_filename, string filename)
        {
            using (var fileStream = File.Create(filler_filename))
            {
                await UpdatedStream.CopyToAsync(fileStream);
                // если не работает асинхронка, мб отдельный поток выделить
            }

            File.Delete(filename); // Delete the existing file if exists
            File.Move(filler_filename, filename); // Rename the oldFileName into newFileName
        }

        public static async Task<stops> GetStops()
        {
            var xmlSerializer = new XmlSerializer(typeof(stops));
            //Stream stopsStream;

            await Update();
            bool canRead = false;
            stops? DeserializedStops = null;
            do
            {
                try
                {
                    var stopsStream = new FileStream("D:/7 СЕМЕСТР/ВЕБ/ToSamaraApiServer/ToSamaraApiServer/Storages/stopsFullDB.xml", FileMode.Open); // try catch добавить
                    DeserializedStops = xmlSerializer.Deserialize(stopsStream) as stops;
                }
                catch (Exception ex)
                {
                    canRead = false;
                }
                canRead = true;
            } while (!canRead);
            // пока что там по умолчанию есть xml-файлы


            return DeserializedStops;
        }

        public static async Task<routes> GetRoutes()
        {
            var xmlSerializer = new XmlSerializer(typeof(routes));

            await Update();

            /*var routesStream = new FileStream("./Storages/routes.xml", FileMode.Open); 
            var DeserializedRoutes = xmlSerializer.Deserialize(routesStream) as routes;*/

            bool canRead = false;
            routes? DeserializedRoutes = null;
            do
            {
                try
                {
                    var routesStream = new FileStream("./Storages/routes.xml", FileMode.Open);
                    DeserializedRoutes = xmlSerializer.Deserialize(routesStream) as routes;
                }
                catch (Exception ex)
                {
                    canRead = false;
                }
                canRead = true;
            } while (!canRead);


            return DeserializedRoutes;
        }
    }
}