//import './style.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { DataLoader } from './DataLoader';
import GeoJSON from 'ol/format/GeoJSON';
import {openNav, closeNav, SearchStop} from './onclickers.js';

import Select from 'ol/interaction/Select';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';



async function Main() {
  console.log('Перед картой');

  //HTMLCanvasElement.getContext('2d', { willReadFrequently: true });

  let search_elem = document.getElementById("search_button");
  search_elem.onclick = SearchStop;

  let open_elem = document.getElementById("open_button");
  open_elem.onclick = openNav;

  let close_elem = document.getElementById("close_button");
  close_elem.onclick = closeNav;


  //let select = null; // ref to currently selected interaction

  const selected = new Style({
    image: new CircleStyle({
      radius: 5,
      fill: null,
      stroke: new Stroke({ color: 'red', width: 2 }),
    }),
    //stroke: new Stroke({
      //color: 'rgba(255, 255, 255, 0.7)',
      //width: 2,
    //}),
  });

  const selectClick = new Select({
    condition: click,
    style: selected,
  });

  /*const changeInteraction = function () {
    if (select !== null) {
      map.removeInteraction(select);
    }
    else{
      select = selectSingleClick;
      map.addInteraction(select);
      select.on('select', function (e) {
        document.getElementById('status').innerHTML =
          '&nbsp;' +
          e.target.getFeatures().getLength() +
          ' selected features (last operation selected ' +
          e.selected.length +
          ' and deselected ' +
          e.deselected.length +
          ' features)';
      });
    }
  }*/

  //selectElement.onchange = changeInteraction;
  //changeInteraction();

  let dataLoader = new DataLoader();
  await dataLoader.loadStops();
  let stopsGeoJson = dataLoader.getStops();
  //console.log(stopsGeoJson);

  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(stopsGeoJson),
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        radius: 5,
        fill: null,
        stroke: new Stroke({ color: 'green', width: 2 }),
      }),
    }),
  });

  // трансформация координат
  const centerProj = fromLonLat([50.1584, 53.2077], "EPSG:3857");
  console.log(centerProj);

  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer,
    ],
    view: new View({
      //center: [5923120.861975739, 6469410.50299372],
      center: centerProj,
      zoom: 12
    })
  });

  map.addInteraction(selectClick);

  console.log('После карты');
}

await Main();