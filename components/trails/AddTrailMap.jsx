import Map, {
  Marker,
  Layer,
  Source,
  NavigationControl,
  FullscreenControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import { BsArrowDownUp } from "react-icons/bs";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

const AddTrailMap = ({
  locations = [],
  onClickSetLocations,
  trailData = [],
  showDirections,
  endPoint,
}) => {
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

    if (trailData.length > 0) {
      setViewport({
        ...viewport,
        longitude: trailData[0].long,
        latitude: trailData[0].lat,
      });
    }
  }, []);

  //google autocomplete
  const [selectedTypeOfSearch, setSelectedTypeOfSearch] = useState(null);
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const [route, setRoute] = useState(null);

  const handleChange = (address) => {
    setAddress(address);
    setSelectedAddress(null);
    setCoordinates({
      lat: null,
      lng: null,
    });
  };

  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setSelectedAddress(selectedAddress);
    geocodeByAddress(selectedAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) =>
        setCoordinates({
          lat: latLng.lat,
          lng: latLng.lng,
        })
      )
      .catch((error) => console.error("Error", error));
  };

  const fetchDataFromApi = async () => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_URL}/api/trips/mapRoute/searchRouteApi`,
        {
          selectedTypeOfSearch: selectedTypeOfSearch,
          coordinates: coordinates,
          endPoint: endPoint,
          accessToken:
            "pk.eyJ1IjoicmlwM3JxIiwiYSI6ImNsZmsxOXFkZjA2ZWo0NG10ZWQzMjJ3ZTEifQ.jigvVhdTvtnv675Fyi4OMA",
        }
      )
      .then((res) => {
        console.log(res.data);
        setRoute(res.data.routes[0].geometry.coordinates);
      });
  };

  useEffect(() => {
    if (!endPoint?.lat || !endPoint?.lng) return;
    if (selectedTypeOfSearch === null) return;
    if (!coordinates?.lat || !coordinates?.lng) return;

    toast.success("Wyznaczam trasę!");
    fetchDataFromApi();
  }, [selectedAddress, endPoint, selectedTypeOfSearch, coordinates]);

  const displayWeatherToast = (data, name) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-xs w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 p-4 w-full">
            <div className="text-center">Pogoda w: {name}</div>
            <div className="flex items-center justify-center">
              <Image
                src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
                alt="pogoda-icona"
                width={80}
                height={80}
              />
            </div>
            <div className="text-center uppercase">
              {data.weather[0].description}
            </div>
          </div>
          <button
            onClick={() => toast.dismiss()}
            className="absolute -top-2 -right-2 bg-gray-400 text-green-200 px-2 rounded-lg hover:text-white hover:bg-red-400"
          >
            X
          </button>
        </div>
      ),
      {
        id: "custom-id-1",
        duration: 20000,
        position: "bottom-right",
      }
    );
  };

  useEffect(() => {
    if (!endPoint?.lat && !endPoint?.lng) return;

    axios
      .post(
        `${process.env.NEXT_PUBLIC_URL}/api/trips/weather/searchWeatherApi`,
        {
          endPoint: endPoint,
        }
      )
      .then((res) => {
        console.log(res.data);
        displayWeatherToast(res.data, endPoint.name);
      });
  }, [endPoint]);

  return (
    <Map
      {...viewport}
      mapStyle="mapbox://styles/rip3rq/clh1zfzrl00lu01quf8z15ffl"
      mapboxAccessToken="pk.eyJ1IjoicmlwM3JxIiwiYSI6ImNsZmsxOXFkZjA2ZWo0NG10ZWQzMjJ3ZTEifQ.jigvVhdTvtnv675Fyi4OMA"
      onMove={(e) => setViewport(e.viewport)}
      onClick={(e) => {
        if (showDirections) return;
        setMarkerPositions([
          ...markerPositions,
          { lat: e.lngLat.lat, long: e.lngLat.lng },
        ]);
        onClickSetLocations(e.lngLat.lng, e.lngLat.lat);
      }}
    >
      {/* dodawanie tracy */}
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
      {/* strona tripów*/}
      {trailData.length > 1 ? (
        <div>
          {/* // Drowing a trail from 1 to last marker */}
          <Source
            id="trip"
            type="geojson"
            data={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: trailData.map((location) => [
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
          <div key="first-marker">
            <Marker
              longitude={trailData[0].long}
              latitude={trailData[0].lat}
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
          <div key="last-marker">
            <Marker
              longitude={trailData[trailData.length - 1].long}
              latitude={trailData[trailData.length - 1].lat}
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
        </div>
      ) : null}

      {/* Show directions part */}
      {showDirections ? (
        <div className="relative">
          <div className="absolute top-2 left-2 w-60">
            {/* wybór miejsc docelowych */}
            <div className="w-full bg-white border-2 border-gray-200 rounded-lg">
              <div className=" grid grid-cols-7">
                <div className="col-span-1 bg-green-400 text-center py-1 text-xl text-white rounded-tl-lg">
                  A
                </div>
                <div className="col-span-6 py-2 ml-2 text-gray-400 text-base">
                  <PlacesAutocomplete
                    value={address}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    debounce={500}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div className="col-span-6 text-gray-400 text-base truncate ">
                        <input
                          {...getInputProps({
                            placeholder: "Wyszukaj miejsce",
                            className: "outline-none",
                          })}
                        />
                        {loading || suggestions.length > 0 ? (
                          <div className=" absolute top-12 left-0 w-max border border-gray-400 rounded-lg bg-white z-50">
                            {loading && (
                              <div className="text-center">Ładowanie...</div>
                            )}
                            {suggestions.map((suggestion) => (
                              <div
                                {...getSuggestionItemProps(suggestion)}
                                key={suggestion.placeId}
                                className="bg-white hover:bg-gray-400 cursor-pointer rounded-lg"
                              >
                                <span className=" px-2">
                                  {suggestion.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
              </div>
              <div className=" grid grid-cols-7 border-t-2 relative">
                <div className="col-span-1 bg-purple-400 text-center py-1 text-xl text-white rounded-bl-lg">
                  B
                </div>
                <div className="col-span-6 py-2 ml-2 text-gray-500 text-base animate-pulse">
                  {endPoint?.name ? endPoint.name : "Wybierz punkt docelowy"}
                </div>
                <div className="absolute -top-2 left-[34px]">
                  <BsArrowDownUp size={13} className="bg-white text-gray-400" />
                </div>
              </div>
            </div>
            {/* wybór trybu nawigacji */}
            <div
              className="w-full flex items-center justify-center bg-slate-100 rounded-xl mt-2 cursor-pointer text-gray-500 font-bold border-2 border-gray-400"
              onClick={(e) => {
                if (e.target.innerText === "Ruch") {
                  setSelectedTypeOfSearch("driving-traffic");
                } else if (e.target.innerText === "Pojazd") {
                  setSelectedTypeOfSearch("driving");
                } else if (e.target.innerText === "Pieszo") {
                  setSelectedTypeOfSearch("walking");
                } else if (e.target.innerText === "Rower") {
                  setSelectedTypeOfSearch("cycling");
                }
              }}
            >
              <div
                className={`w-full text-center hover:bg-green-400 rounded-xl ${
                  selectedTypeOfSearch === "driving-traffic" && "bg-green-300"
                }`}
              >
                Ruch
              </div>
              <div
                className={`w-full text-center hover:bg-green-400 rounded-xl ${
                  selectedTypeOfSearch === "driving" && "bg-green-300"
                }`}
              >
                Pojazd
              </div>
              <div
                className={`w-full text-center hover:bg-green-400 rounded-xl ${
                  selectedTypeOfSearch === "walking" && "bg-green-300"
                }`}
              >
                Pieszo
              </div>
              <div
                className={`w-full text-center hover:bg-green-400 rounded-xl ${
                  selectedTypeOfSearch === "cycling" && "bg-green-300"
                }`}
              >
                Rower
              </div>
            </div>
          </div>
          <FullscreenControl />
          <NavigationControl />
        </div>
      ) : null}

      {/* Pokazywanie trasy dojazdu */}
      {showDirections && coordinates ? (
        <div>
          <Marker longitude={coordinates.lng} latitude={coordinates.lat}>
            <p className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400 text-white uppercase font-bold">
              A
            </p>
          </Marker>
        </div>
      ) : null}
      {showDirections && endPoint ? (
        <div>
          <Marker longitude={endPoint.lng} latitude={endPoint.lat}>
            <p className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white uppercase font-bold">
              B
            </p>
          </Marker>
        </div>
      ) : null}
      {showDirections && route ? (
        <div>
          {/* // Drowing a trail from 1 to last marker */}
          <Source
            id="route"
            type="geojson"
            data={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: route,
              },
            }}
          >
            <Layer
              id="route-trail"
              source="route"
              type="line"
              paint={{
                "line-color": "#800080",
                "line-width": 4,
              }}
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
            />
          </Source>
        </div>
      ) : null}
    </Map>
  );
};

export default AddTrailMap;
