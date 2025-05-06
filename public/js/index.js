import { displayMap } from './map';

const map = document.getElementById('map');

if (map) {
  displayMap(JSON.parse(map.dataset.locations));
}
