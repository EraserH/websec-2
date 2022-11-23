//import './style.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { DataLoader } from './DataLoader';
import GeoJSON from 'ol/format/GeoJSON';
import { openNav, closeNav, SearchStop } from './onclickers.js';
import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';

import Select from 'ol/interaction/Select';
import { altKeyOnly, click, pointerMove } from 'ol/events/condition';



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

  selectClick.on('select', function (e) {
    alert(e.selected);
    console.log(e.selected[0]);
    //console.log(e.selected[0].values_);
    console.log(e.selected[0].values_.KS_ID);
    console.log(e.selected[0].values_.title);
  });


  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');

  /**
   * Create an overlay to anchor the popup to the map.
   */
  const overlay = new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  /**
   * Add a click handler to hide the popup.
   * @return {boolean} Don't follow the href.
   */
  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };


  let dataLoader = new DataLoader();
  await dataLoader.loadStops();
  let stopsGeoJson = dataLoader.getStops();

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
    overlays: [overlay],
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

  map.on('singleclick', function (evt) {
    const coordinate = evt.coordinate;
    const hdms = toStringHDMS(toLonLat(coordinate));
  
    content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
    overlay.setPosition(coordinate);
  });

  console.log('После карты');
}

await Main();


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