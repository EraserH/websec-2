import { DataLoader } from "./DataLoader";

export function openNav() {
    if (window.screen.width <= 500) {
        document.getElementById("mySidenav").style.width = "80%";
    }
    else {
        document.getElementById("mySidenav").style.width = "30%";
    }
}

export function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

export async function SearchStop(selectClick, vectorSource, dataLoader, map) {
    let template = document.getElementById('search').value;

    await dataLoader.loadRoutes();

    let selectedStopsFeatures = [];
    let selectedRoutesFeatures = [];
    let ind = 0;

    let regexp = new RegExp(template, "i");
    
    for (let [_, feature] of Object.entries(vectorSource.getFeatures())) {
        if (feature.values_.title.match(regexp) != null) {
            selectedStopsFeatures[ind] = feature;
            ind++;
        }
    }

    ind = 0;
    let routes = JSON.parse(dataLoader.getRoutes());
    console.log(routes);
    for (let key in routes) {
        if (routes[key].number.match(regexp) != null) {
            console.log(routes[key]);
            selectedRoutesFeatures[ind] = routes[key];
            ind++;
        }
    }

    let sideNav = document.getElementById('SideBarStop');
    sideNav.innerHTML = "";
    let htmlToAdd = "";

    if (selectedStopsFeatures.length == 0 && selectedRoutesFeatures.length == 0) {
        htmlToAdd = "<div class='notFound'><p>Ничего не найдено!</p><p>Попробуйте снова.</p></div>";
        sideNav.innerHTML = htmlToAdd;
        return;
    }
    if (selectedStopsFeatures.length > 0) {
        console.log("Остановки есть");
        htmlToAdd = "<p class='headerSideNav'>Остановки:</p>";
        for (let i = 0; i < selectedStopsFeatures.length; i++) {
            htmlToAdd += `<a href='#' id='stop-${i.toString()}' class='stopRouteLink'>${selectedStopsFeatures[i].values_.title}; 
            ${selectedStopsFeatures[i].values_.direction}</a>`;

            console.log(selectedStopsFeatures[i].values_.title);
        }
    }
    if (selectedRoutesFeatures.length > 0){
        console.log("Маршруты есть");
        htmlToAdd += "<p class='headerSideNav'>Маршруты:</p>";
        for (let i = 0; i < selectedRoutesFeatures.length; i++) {
            htmlToAdd += `<a href='#' id='route-${i.toString()}' class='stopRouteLink'>Маршрут: ${selectedRoutesFeatures[i].number} ${selectedRoutesFeatures[i].transportType}; 
            Направление: ${selectedRoutesFeatures[i].direction}</a>`;
        }
    }

    sideNav.innerHTML = htmlToAdd;

    async function addEventListeners(){
        console.log("Кол-во остановок: " + selectedStopsFeatures.length);
        for (let i = 0; i < selectedStopsFeatures.length; i++) {
            let ref_elem = document.getElementById(`stop-${i.toString()}`);
            ref_elem.addEventListener('click', async function () {
                await DealWithStop(selectedStopsFeatures[i], selectClick, dataLoader, map);
            });
        }
        
        console.log("Кол-во маршрутов: " + selectedRoutesFeatures.length);
        for (let i = 0; i < selectedRoutesFeatures.length; i++) {
            let ref_elem = document.getElementById(`route-${i.toString()}`);
            ref_elem.addEventListener('click', async function () {
                await showRoute(selectedRoutesFeatures[i], dataLoader);
            });
        }
    }
    
    await addEventListeners();

    console.log("Ну так что?");
    return;
}

async function DealWithStop(selectedFeature, selectClick, dataLoader, map) {

    console.log(selectedFeature.values_);
    console.log(selectedFeature.values_.geometry.flatCoordinates);

    selectClick.getFeatures().clear();
    selectClick.getFeatures().push(selectedFeature);

    map.getView().setCenter(selectedFeature.values_.geometry.flatCoordinates);
    map.getView().setZoom(17);

    await showStop(selectedFeature, dataLoader);
}

export async function showStop(feature, showStopDataLoader) {
    if (!feature) return;

    let sideNav = document.getElementById('SideBarStop');
    sideNav.innerHTML = "";
    let htmlToAdd = "";

    let prognosis = await showStopDataLoader.getForecastsStops(feature.values_.KS_ID, 5);

    htmlToAdd = `<div class='stopAdded'><p class='itemTitle'>${feature.values_.title}</p>` +
        `<p class='itemDirection'>${feature.values_.direction}</p><p>`;

    let progCount = prognosis.arrival.length;

    if (progCount == 0) {
        htmlToAdd += "Нет прогнозов"
    }
    for (let i = 0; i < (5 < progCount ? 5 : progCount); i++) {
        htmlToAdd += `<div class='progItem'><ol>` +
            `<li>Номер маршрута: ${prognosis.arrival[i].number}</li>` +
            `<li>Тип: ${prognosis.arrival[i].type}</li>` +
            `<li>Время: ${prognosis.arrival[i].time} минут</li>` +
            `<li>Следующая остановка: ${prognosis.arrival[i].nextStopName}</li>` +
            '</ol></div>';
    }
    htmlToAdd += '</p>';

    sideNav.innerHTML = htmlToAdd;

    return;
}

async function showRoute(feature, showRouteDataLoader) {
    if (!feature) return;

    let sideNav = document.getElementById('SideBarStop');
    sideNav.innerHTML = "";
    let htmlToAdd = "";

    let picSrc = "";
    switch(feature.transportTypeID){
        case 1:
            picSrc = "./icons/bus.png";
            break;
        case 2: 
            picSrc = "./icons/subway.png";
            break;
        case 3: 
            picSrc = "./icons/tram.png";
            break;
        case 4: 
            picSrc = "./icons/trolleybus.png";
            break;
        case 5: 
            picSrc = "./icons/train.png";
            break;
        case 6: 
            picSrc = "./icons/water-taxi.png";
            break;
        default:
            picSrc = "./icons/undefined.png";
            break;
    }

    let schedule = await showRouteDataLoader.getRouteSchedule(feature.kR_ID);
    console.log(schedule);

    htmlToAdd = `<div class='stopAdded'><img class='icon' src='${picSrc}' alt='Иконка'/><p class='itemTitle'>
    Маршрут: ${feature.number}</p>` +
        `<p class='itemDirection'>Тип: ${feature.transportType}</p>` +
        `<p class='itemDirection'>Направление: ${feature.direction}</p><p>`;

    let scheduleStopsCount = schedule.stops.length;

    if (!schedule || scheduleStopsCount == 0) {
        htmlToAdd += "Нет расписания на сегодня"
    }
    else{
        htmlToAdd += "<div class='scheduleItem'><ol>";
        for (let stopKey in schedule.stops) {
            console.log(stopKey);
            console.log(schedule.stops[stopKey]);
            htmlToAdd += `<li class='stopInSchedule'>${schedule.stops[stopKey]}</li>`;
        }
        htmlToAdd += '</ol></div>';
    }
    htmlToAdd += "</p>";

    sideNav.innerHTML = htmlToAdd;

    return;
}
