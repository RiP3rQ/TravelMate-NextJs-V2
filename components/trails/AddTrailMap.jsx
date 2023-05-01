import Map, { Marker, Layer, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";

const AddTrailMap = ({ locations, onClickSetLocations }) => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    longitude: 17.926126,
    latitude: 50.671062,
    zoom: 11,
  });

  const [markerPositions, setMarkerPositions] = useState([]);

  useEffect(() => {
    if (locations.length > 0) {
      setMarkerPositions(locations);
    }
  }, []);

  console.log(locations);

  return (
    <Map
      {...viewport}
      mapStyle="mapbox://styles/rip3rq/clh1zfzrl00lu01quf8z15ffl"
      mapboxAccessToken="pk.eyJ1IjoicmlwM3JxIiwiYSI6ImNsZmsxOXFkZjA2ZWo0NG10ZWQzMjJ3ZTEifQ.jigvVhdTvtnv675Fyi4OMA"
      onMove={(e) => setViewport(e.viewport)}
      onClick={(e) => {
        setMarkerPositions([
          ...markerPositions,
          { lat: e.lngLat.lat, long: e.lngLat.lng },
        ]);
        onClickSetLocations(e.lngLat.lng, e.lngLat.lat);
      }}
    >
      {markerPositions.length > 1 ? (
        // Drowing a trail from 1 to last marker
        <Source
          id="trail"
          type="geojson"
          data={{
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: markerPositions.map((location) => [
                location.long,
                location.lat,
              ]),
            },
          }}
        >
          <Layer
            id="layer-trail"
            source="trail"
            type="line"
            paint={{
              "line-color": "#888",
              "line-width": 4,
            }}
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
          />
        </Source>
      ) : null}
      {markerPositions?.map((location, index) => {
        if (index === 0) {
          return (
            <div key={index}>
              <Marker
                longitude={location.long}
                latitude={location.lat}
                offset={[0, 0]}
              >
                <p
                  className="cursor-pointer text-sm"
                  aria-label="push-pin"
                  role="img"
                >
                  📌
                </p>
              </Marker>
            </div>
          );
        } else if (index === markerPositions.length - 1) {
          return (
            <div key={index}>
              <Marker
                longitude={location.long}
                latitude={location.lat}
                offset={[0, 0]}
              >
                <p
                  className="cursor-pointer text-sm"
                  aria-label="push-pin"
                  role="img"
                >
                  🎯
                </p>
              </Marker>
            </div>
          );
        }
      })}
    </Map>
  );
};

export default AddTrailMap;
