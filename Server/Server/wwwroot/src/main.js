//import './style.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { DataLoader } from './DataLoader';
import GeoJSON from 'ol/format/GeoJSON';
import { openNav, closeNav, SearchStop, showStop } from './onclickers.js';
//import Overlay from 'ol/Overlay';
//import {toLonLat} from 'ol/proj';
//import {toStringHDMS} from 'ol/coordinate';

import {Control, defaults as defaultControls} from 'ol/control';

import Select from 'ol/interaction/Select';
import { altKeyOnly, click, pointerMove } from 'ol/events/condition';


class OpenSideNavControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '&#9776';

    const element = document.createElement('div');
    element.className = 'open_sidenav ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', openNav);
  }
}


async function Main() {
  console.log('Перед картой');

  let close_elem = document.getElementById("close_button");
  close_elem.onclick = closeNav;


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
        fill: new Fill({
          color: 'green',
        }),
        stroke: new Stroke({ color: 'green', width: 2 }),
      }),
    }),
  });

  // трансформация координат
  const centerProj = fromLonLat([50.1584, 53.2077], "EPSG:3857");

  const map = new Map({
    controls: defaultControls().extend([new OpenSideNavControl()]),
    target: 'map',
    //overlays: [overlay],
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer,
    ],
    view: new View({
      center: centerProj,
      zoom: 12
    })
  });


  const selected = new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: 'red',
      }),
      stroke: new Stroke({ color: 'red', width: 2 }),
    })
  });

  const selectClick = new Select({
    condition: click,
    style: selected,
  });

  selectClick.on('select', async function (e) {
    await showStop(e.selected[0], dataLoader);
    openNav();
  });
  
  map.addInteraction(selectClick);

  let search_elem = document.getElementById("search_button");
  search_elem.addEventListener('click', async function(){
    await SearchStop(selectClick, vectorSource, dataLoader, map);
  });

  console.log('После карты');
}

await Main();
