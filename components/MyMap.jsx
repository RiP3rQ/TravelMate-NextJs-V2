import { getCenter } from "geolib";
import React, { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import MapInfoCard from "./MapInfoCard";

const MyMap = ({ searchResults }) => {
  const [selectedLocation, setSelectedLocation] = useState({});

  // Transform the search results object into the {latitude: 52.516272, longitude: 13.377722} object
  const coordinates = searchResults?.map((result) => ({
    longitude: result.long,
    latitude: result.lat,
  }));

  // center the map view to the coordinates from the search results
  const center = getCenter(coordinates);
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    longitude: center.longitude,
    latitude: center.latitude,
    zoom: 11,
  });

  const flyToMarker = (result) => {
    setViewport({
      ...viewport,
      longitude: result.long,
      latitude: result.lat,
      zoom: 11,
    });
  };

  return (
    <Map
      {...viewport}
      mapStyle="mapbox://styles/rip3rq/clfk003pa000q01qzsp20ktft"
      mapboxAccessToken="pk.eyJ1IjoicmlwM3JxIiwiYSI6ImNsZmsxOXFkZjA2ZWo0NG10ZWQzMjJ3ZTEifQ.jigvVhdTvtnv675Fyi4OMA"
      onMove={(e) => setViewport(e.viewport)}
    >
      {searchResults.map((result) => (
        <div key={result.long}>
          {/* Placing markers all over the map make sure to import css file for mapbox */}
          <Marker
            longitude={result.long}
            latitude={result.lat}
            offset={[-20, -10]}
          >
            <p
              className="cursor-pointer text-2xl animate-bounce"
              aria-label="push-pin"
              role="img"
              onClick={() => {
                setSelectedLocation(result);
                flyToMarker(result);
              }}
            >
              🏡
            </p>
          </Marker>
          {/* the popup that should show if we click on a Marker */}
          {selectedLocation.long == result.long ? (
            <Popup
              onClose={() => setSelectedLocation({})} // close the popup when we click on the close button
              longitude={result.long}
              latitude={result.lat}
              closeOnClick={false}
              closeButton={true}
              anchor="bottom"
              offset={[-20, -35]}
              style={{ maxWidth: "384px", position: "relative" }}
            >
              <div className="h-full w-full bg-white">
                <MapInfoCard
                  img={result.img}
                  location={result.location}
                  title={result.title}
                  description={result.description}
                  star={result.star}
                  price={result.price}
                  total={result.total}
                />
              </div>
            </Popup>
          ) : (
            false
          )}
        </div>
      ))}
    </Map>
  );
};

export default MyMap;
