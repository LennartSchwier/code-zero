import React, { useContext, useState } from 'react';
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from '@react-google-maps/api';
import MapStyles from '../../commons/MapStyles';
import styled from 'styled-components/macro';
import { MdCancel, MdDone } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import RouteContext from '../../contexts/RouteContext';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const options = {
  styles: MapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function NewRouteMap({ latitude, longitude }) {
  const history = useHistory();
  const { addNewRouteAndUpdateAllRoutes } = useContext(RouteContext);

  const [waypoints, setWaypoints] = useState([]);
  const [routeName, setRouteName] = useState('');
  const [showName, setShowName] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <p>Error loading map</p>;
  }
  if (!isLoaded) {
    return <p>Loading map</p>;
  }
  if (isLoaded) {
    return (
      <MapContainer>
        {showName ? (
          <div>
            <h1>{routeName}</h1>
          </div>
        ) : (
          <div>
            <input
              type={'text'}
              placeholder={'name of your route'}
              value={routeName}
              onChange={(event) => setRouteName(event.target.value)}
            />
            <button className={'saveName'} onClick={saveRouteName}>
              Save route name
            </button>
          </div>
        )}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={centerMap()}
          options={options}
          onClick={clickHandler}
        >
          {waypoints.map((waypoint) => (
            <Marker
              position={waypoint}
              key={waypoints.indexOf(waypoint)}
              label={labelMarker(waypoints, waypoint)}
            />
          ))}
          <Polyline path={waypoints} />
        </GoogleMap>
        <button className={'cancel'} onClick={redirectBackToRoutes}>
          <MdCancel />
          Cancel
        </button>
        <button className={'done'} onClick={createRoute}>
          <MdDone />
          Done
        </button>
      </MapContainer>
    );
  }

  function centerMap() {
    if (waypoints.length === 0) {
      return {
        lat: latitude,
        lng: longitude,
      };
    }
    return {
      lat: waypoints[waypoints.length - 1].lat,
      lng: waypoints[waypoints.length - 1].lng,
    };
  }

  function clickHandler(event) {
    setWaypoints([
      ...waypoints,
      { lat: event.latLng.lat(), lng: event.latLng.lng() },
    ]);
  }

  function labelMarker(collection, item) {
    if (collection.indexOf(item) === 0) {
      return 'Start';
    }
    if (collection.indexOf(item) + 1 === collection.length) {
      return 'End';
    }
    return String(collection.indexOf(item));
  }

  function saveRouteName() {
    setShowName(!showName);
  }

  function redirectBackToRoutes() {
    history.push('/routes');
  }

  function createRoute() {
    const startWaypoint = {
      startLatitude: waypoints[0].lat,
      startLongitude: waypoints[0].lng,
    };
    const waypointsWithoutStart = waypoints.slice(1, waypoints.length);
    const legs = [];

    for (let i = 0; i < waypointsWithoutStart.length; i++) {
      if (i === 0) {
        legs[i] = {
          startLatitude: startWaypoint.startLatitude.toFixed(6),
          startLongitude: startWaypoint.startLongitude.toFixed(6),
          endLatitude: waypointsWithoutStart[i].lat.toFixed(6),
          endLongitude: waypointsWithoutStart[i].lng.toFixed(6),
        };
      }
      if (i > 0) {
        legs[i] = {
          startLatitude: waypointsWithoutStart[i - 1].lat.toFixed(6),
          startLongitude: waypointsWithoutStart[i - 1].lng.toFixed(6),
          endLatitude: waypointsWithoutStart[i].lat.toFixed(6),
          endLongitude: waypointsWithoutStart[i].lng.toFixed(6),
        };
      }
    }
    const payload = { routeName: routeName, legs: legs };
    addNewRouteAndUpdateAllRoutes(payload);
    history.push('/routes');
  }
}

const MapContainer = styled.section`
  width: 100vw;
  height: 100vh;

  h1,
  input {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 10;
    margin: 0;
  }

  svg {
    width: var(--size-xxl);
    height: var(--size-xxl);
  }

  button {
    position: absolute;
    z-index: 10;
    border: none;
    background: none;
  }

  .saveName {
    top: 1rem;
    right: 1rem;
  }

  .cancel,
  .done {
    display: grid;
    justify-items: center;
    bottom: 2rem;
  }

  .cancel {
    left: 1rem;
    color: darkred;
  }

  .done {
    left: 6rem;
  }
`;
