import querystring from "querystring";

const fetchWithCSRFToken = (csrfUrl, fetchUrl, options) => {
  return fetch(csrfUrl)
    .then((response) => response.text())
    .then((csrfToken) => {
      options.headers.append("X-CSRF-Token", csrfToken);
      return fetch(fetchUrl, options);
    });
};

const getSpotifyFetchTokenOptions = (basicAuth) => {
  return {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "client_credentials",
    }),
  };
};

const fetchSpotifyArtistWithToken = (
  tokenUrl,
  fetchArtistUrl,
  fetchOptions
) => {
  return fetch(tokenUrl, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      return fetch(fetchArtistUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
        },
      });
    });
};

export {
  fetchWithCSRFToken,
  getSpotifyFetchTokenOptions,
  fetchSpotifyArtistWithToken,
};
