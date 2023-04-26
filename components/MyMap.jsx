import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import MapInfoCard from "./MapInfoCard";
import { RiMapPinFill } from "react-icons/ri";

const MyMap = ({
  searchResults,
  rentModal,
  onClickRentModal,
  isListingMap,
  lat,
  long,
  currentUser,
  refetchUser,
  page,
  showMarkerForListing,
}) => {
  const [selectedLocation, setSelectedLocation] = useState({});
  const [clickedLocation, setClickedLocation] = useState({});

  const viewportLong = isListingMap ? long : 17.926126;
  const viewportLat = isListingMap ? lat : 50.671062;
  const viewportZoom = isListingMap ? 14 : 11;

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    longitude: viewportLong,
    latitude: viewportLat,
    zoom: viewportZoom,
  });

  const flyToMarker = (result) => {
    setViewport({
      ...viewport,
      longitude: result.long,
      latitude: result.lat,
      zoom: 15,
    });
  };

  useEffect(() => {
    if (showMarkerForListing) {
      flyToMarker(
        searchResults.find((result) => result.id === showMarkerForListing)
      );
    }
  }, [showMarkerForListing]);

  return (
    <Map
      {...viewport}
      mapStyle="mapbox://styles/rip3rq/clfk003pa000q01qzsp20ktft"
      mapboxAccessToken="pk.eyJ1IjoicmlwM3JxIiwiYSI6ImNsZmsxOXFkZjA2ZWo0NG10ZWQzMjJ3ZTEifQ.jigvVhdTvtnv675Fyi4OMA"
      onMove={(e) => setViewport(e.viewport)}
      onClick={(e) => {
        setClickedLocation({
          lat: e.lngLat.lat,
          long: e.lngLat.lng,
        });
        if (rentModal) {
          onClickRentModal(e.lngLat.lng, e.lngLat.lat);
        }
      }}
    >
      {searchResults?.map((result) => (
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
                  id={result.id}
                  img={result.imageSrc}
                  title={result.title}
                  description={result.description}
                  price={result.price}
                  star={result.star}
                  currentUser={currentUser}
                  refetchUser={refetchUser}
                  page={page}
                />
              </div>
            </Popup>
          ) : (
            false
          )}
          {/* show popup for listing that user wants to see on map */}
          {showMarkerForListing === result.id ? (
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
                  id={result.id}
                  img={result.imageSrc}
                  title={result.title}
                  description={result.description}
                  price={result.price}
                  star={result.star}
                  currentUser={currentUser}
                  refetchUser={refetchUser}
                  page={page}
                />
              </div>
            </Popup>
          ) : null}
        </div>
      ))}

      {/* display marker on click if rentModal is open */}
      {rentModal && clickedLocation.lat ? (
        <Marker
          longitude={clickedLocation.long}
          latitude={clickedLocation.lat}
          offset={[0, -20]}
        >
          <RiMapPinFill size={40} color="red" />
        </Marker>
      ) : null}

      {/* display marker on listing page */}
      {isListingMap && lat && long ? (
        <Marker longitude={long} latitude={lat} offset={[0, -20]}>
          <RiMapPinFill size={40} color="red" />
        </Marker>
      ) : null}
    </Map>
  );
};

export default MyMap;
