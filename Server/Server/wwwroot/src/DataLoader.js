// остановка с координатами
// прогноз для каждой остановки
// маршруты с остановками
export class DataLoader {
    static tosamara = "https://tosamara.ru/api/v2/json";
    static server = "https://localhost:7269/api/";
    static StopsGeoJson = null;
    static RoutesJson = null;

    constructor(){
        this.sha1 = require('sha1');
    }

    async loadStops(){
        let response = await fetch(`${DataLoader.server}Stops`);
        if (response.ok){
            DataLoader.StopsGeoJson = await response.text();
        }
        else{
            alert("Ошибка HTTP: " + response.status);
        }
    }

    async loadRoutes(){
        let response = await fetch(`${DataLoader.server}Routes`);
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

    async getForecastsStops(KS_ID, fCOUNT){
        let messagesk = `${KS_ID}` + `${fCOUNT}` + 'just_f0r_tests';
        let key = this.sha1(messagesk);
        let forecasts = null;
        let response = await fetch(`${DataLoader.tosamara}?method=getFirstArrivalToStop&KS_ID=${KS_ID}&COUNT=${fCOUNT}&os=android&clientid=test&authkey=${key}`);
        if (response.ok){
            forecasts = await response.json();
        }
        else{
            alert("Ошибка HTTP: " + response.status);
        }
        return forecasts;
    }
     async getRouteSchedule(KR_ID){
        console.log(KR_ID);
        let date = new Date();
        let strDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

        console.log(strDate);
        let messagesk = `${KR_ID}` + `${strDate}` + 'just_f0r_tests';
        console.log(messagesk);
        let key = this.sha1(messagesk);
        let schedule = null;
        let response = await fetch(`${DataLoader.tosamara}?method=getRouteSchedule&KR_ID=${KR_ID}&day=${strDate}&os=android&clientid=test&authkey=${key}`);
        if (response.ok){
            schedule = await response.json();
        }
        else{
            alert("Ошибка HTTP: " + response.status);
        }
        return schedule;
     }
}