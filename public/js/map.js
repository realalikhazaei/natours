/* eslint-disable */

export const displayMap = locations => {
  const map = L.map('map', {
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    zoomControl: false,
  }).setView([0, 0], 2);

  L.control
    .zoom({
      position: 'bottomleft',
    })
    .addTo(map);

  const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const features = locations.map(location => {
    return {
      type: 'Feature',
      properties: { popupContent: `Day ${location.day}. ${location.description}` },
      geometry: {
        type: 'Point',
        coordinates: location.coordinates,
      },
    };
  });

  const myGeoJson = {
    type: 'FeatureCollection',
    features,
  };

  const geojsonLayer = L.geoJSON(myGeoJson, {
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.popupContent) {
        layer
          .bindPopup(feature.properties.popupContent, {
            autoClose: false, // do not auto-close when another popup opens
            closeOnClick: false, // keep popup open on map clicks
            maxWidth: 250,
            minWidth: 100,
            className: 'custom-popup',
          })
          .openPopup(); // open the popup immediately
      }
    },
  }).addTo(map);

  map.fitBounds(geojsonLayer.getBounds());
};
