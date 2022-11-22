import { DataLoader } from "./DataLoader";

export function SearchStop(){
    let template = document.getElementById('search').value;
    let searchDataLoader = new DataLoader();
    const stopsToParse = JSON.parse(searchDataLoader.getStops());

    for (let [index, feature] of Object.entries(stopsToParse.features)){
        if (feature.properties.title == template){
            alert(feature.geometry.coordinates);
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