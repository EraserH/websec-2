import { DataLoader } from "./DataLoader";

export async function SearchStop(){
    let template = document.getElementById('search').value;
    let searchDataLoader = new DataLoader();
    const stopsToParse = JSON.parse(searchDataLoader.getStops());

    for (let [index, feature] of Object.entries(stopsToParse.features)){
        if (feature.properties.title == template){
            //alert(feature.geometry.coordinates);
            let sideNav = document.getElementById('SideBarStop');
            let prognosis = await searchDataLoader.getForecasts(feature.properties.KS_ID, 5);
            console.log(feature.properties.KS_ID);
            console.log(prognosis);
            console.log(prognosis.arrival[0].number);
            console.log(prognosis.arrival[1]);
            
            let singlePrognosis;
            let htmlToAdd = `<div class='stopAdded'><p class='stopItem'>${feature.properties.title}</p>` + 
            `<p class='stopItem'>${feature.properties.direction}</p><p>`;
            for (let i = 0; i < 5; i++){
                htmlToAdd += `<div class='progItem'><ol>` + 
                `<li>Номер: ${prognosis.arrival[i].number}</li>` +
                `<li>Тип: ${prognosis.arrival[i].type}</li>` +
                `<li>Время: ${prognosis.arrival[i].time}</li>` +
                `<li>Следующая остановка: ${prognosis.arrival[i].nextStopName}</li>` +
                '</ol></div>';
            }
            htmlToAdd += '</p>';

            /*htmlToAdd = `<div class='stopAdded'><p class='stopItem'>${feature.properties.title}</p>` + 
            `<p class='stopItem'>${feature.properties.direction}</p>` +
            `<p><ul class='stopItem'><li>${prognosis[0]}</li><li>${prognosis[1]}</li>` +
            `<li>${prognosis[2]}</li><li>${prognosis[3]}</li><li>${prognosis[4]}</li></ul></p></div>`;*/
            
            sideNav.innerHTML = htmlToAdd;
            return;
        }
    }
}

export function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

export function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}