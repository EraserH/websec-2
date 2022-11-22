
// остановка с координатами
// прогноз для каждой остановки
// маршруты с остановками
export class DataLoader {
    static StopsGeoJson = null;
    static RoutesJson = null;

    constructor(){
        //this.Stops = null; // геоджсончик
        //this.Routes = null;

        this.sha1 = require('sha1');
        //this.xmlParser = require("xml-parse");
    }

    async loadStops(){
        let response = await fetch('https://localhost:7269/api/Stops');
        if (response.ok){
            DataLoader.StopsGeoJson = await response.text();
        }
        else{
            alert("Ошибка HTTP: " + response.status);
        }
    }

    static async loadRoutes(){
        let response = await fetch('https://localhost:7269/api/Routes');
        if (response.ok){
            DataLoader.RoutesJson = await response.text();
        }
        else{
            alert("Ошибка HTTP: " + response.status);
        }
    }

    getStops(){
        return DataLoader.StopsGeoJson;
    }

    getRoutes(){
        return DataLoader.RoutesJson;
    }

    async getForecasts(KS_ID, fCOUNT){
        let messagesk = `${KS_ID}` + `${fCOUNT}` + 'just_f0r_tests';
        console.log(messagesk);
        let key = this.sha1(messagesk);
        console.log(key);
        let forecasts = null;
        let response = await fetch(`https://tosamara.ru/api/v2/json?method=getFirstArrivalToStop&KS_ID=${KS_ID}&COUNT=${fCOUNT}&os=android&clientid=test&authkey=${key}`);
        if (response.ok){
            forecasts = await response.json();
        }
        else{
            alert("Ошибка HTTP: " + response.status);
        }
        return forecasts;
    }

    transformCoordinates(){}
}