import React, { useState } from "react";
import Artist from "./Artist";
import FetchForm from "./FetchForm";
import StatusMessage from "./StatusMessage";
import { Buffer } from "buffer";
// Import scss files.
import "../../css/styles.scss";
import {
  statusTypes,
  statusTitle,
  statusMessageText,
} from "../tools/statusMessageProps";
import {
  fetchWithCSRFToken,
  getSpotifyFetchTokenOptions,
  fetchSpotifyArtistWithToken,
} from "../tools/fetchWithToken";

const status = { done: false };
const emptyDataMessage =
  "No data available. Click the button below to fetch one.";
// Grab html placeholder from field formatter output.
const rootElement = document.getElementById("spotify-artists");
// Get JSON data of content sent from Drupal.
const artistsList = JSON.parse(rootElement.dataset.artists) || [];
// Number of artists currently being displayed.
const artistCounter = Number(JSON.parse(rootElement.dataset.counter));
// Maximum number of artists we can fetch.
const maxNumOfArtist = 20;
// Spotify Client ID.
const client_id = "001214ea0bb046aa8b93497d2735b7cd";
// Spotify Client secret key.
const client_secret = "a824cbd614d04e00afd49af8d7181773";
// Headers authorization type.
const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
  "base64"
);
// Url to fetch Spotify token for authentication.
const fetchSpotifyTokenUrl = "https://accounts.spotify.com/api/token";
// Set website base url.
const baseUrl = window.location.origin;
// Set url for sending patch request the server.
const postRequestUrl = `${baseUrl}/api/post/node/admin/create_artist`;
// Set url for fetching CSRF token.
// This is to prevent CSRF attachs when performing PATCH/POST/PUT requests.
const csrfRequestUrl = `${baseUrl}/session/token?_format=json`;

const Artists = () => {
  // React Hooks to handle the state of the artists data
  // and when it changes.
  const [artists, setArtists] = useState(artistsList.artists);
  // React Hooks to handle the state of the StatusMessage variable.
  // Message types: none, status, warning, error.
  const [statusMessage, setStatusMessage] = useState({
    type: statusTypes.none,
    title: "",
    message: "",
  });
  // React hook to handle fetch status.
  const [fetchStatus, setFetchStatus] = useState(status.done);
  // React hook to handle state of counter.
  const [counter, setCounter] = useState(artistCounter);
  // Get Spotify fetch token options.
  const spotifyFetchTokenOptions = getSpotifyFetchTokenOptions(basicAuth);

  // Set status message.
  // Message types: success, warning, error.
  const setMessage = (type, title, message) => {
    setStatusMessage({ type, title, message });
  };

  const getArtist = (spotifyId) => {
    // Copy artists data to a new variable.
    const newArtists = artists ? [...artists] : [];
    // Url to fetch artist information.
    const fetchArtistUrl = `https://api.spotify.com/v1/artists/${spotifyId}`;
    setFetchStatus(!status.done);
    if (counter < maxNumOfArtist) {
      try {
        // Fetch Spotify token for authorisation.
        fetchSpotifyArtistWithToken(
          fetchSpotifyTokenUrl,
          fetchArtistUrl,
          spotifyFetchTokenOptions
        )
          .then((response) => response.json())
          // If fetch is successful, fetch artists data.
          .then((data) => {
            newArtists.push({ spotify_id: data.id, name: data.name });
            if (counter === 0) {
              setArtists(newArtists);
            }

            if (
              newArtists.find((elem) => elem.spotify_id === data.id) ||
              counter === 0
            ) {
              // Post data header options.
              const options = {
                method: "POST",
                headers: new Headers({
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Cache: "no-cache",
                }),
                body: JSON.stringify([
                  {
                    name: data.name,
                    image_url: data.images.filter(
                      (elem) => elem.height === 320
                    ),
                    genres: data.genres,
                    followers: data.followers.total,
                    spotify_id: data.id,
                  },
                ]),
              };

              // Send post request to create artist entity type.
              fetchWithCSRFToken(csrfRequestUrl, postRequestUrl, options)
                .then((response) => response.text())
                .then((payload) => payload);

              //newArtists.push({ name: data.name, spotify_id: data.id });
              setArtists(newArtists);
              // Set status message.
              setMessage(
                statusTypes.success,
                statusTitle.success,
                statusMessageText.success
              );
              // Increase counter value after successfully completing a fetch.
              setCounter(counter + 1);
            } else {
              // Set status message.
              setMessage(
                statusTypes.error,
                statusTitle.error,
                statusMessageText.duplicate
              );
            }
            setFetchStatus(status.done);
          })
          // If no authorisation show status message to user.
          .catch((error) => {
            // Change fetch status to done.
            setFetchStatus(status.done);
            // Set status message.
            setMessage(
              statusTypes.error,
              statusTitle.error,
              statusMessageText.noData
            );
          });
      } catch (error) {
        // Change fetch status to done.
        setFetchStatus(status.done);
        return error;
      }
    } else {
      setFetchStatus(status.done);
      // Set status message.
      setMessage(
        statusTypes.error,
        statusTitle.error,
        statusMessageText.maxCountReached
      );
    }
  };

  return (
    <div className="Artists">
      <StatusMessage statusMessage={statusMessage} />
      {artists ? (
        <Artist artists={artists} fetchStatus={fetchStatus} />
      ) : (
        <div className="empty-data">{emptyDataMessage}</div>
      )}
      <FetchForm onClick={getArtist} />
    </div>
  );
};

export default Artists;
