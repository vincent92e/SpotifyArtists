import React from "react";

const Artist = (props) => {
  const artists = props.artists;

  return (
    <div className="artist" style={{ position: "relative" }}>
      {props.fetchStatus && <div className="fetching">Fetching data...</div>}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Spotify Id</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist, index) => {
            return (
              <tr key={index}>
                <td>{++index}</td>
                <td>{artist.name}</td>
                <td>{artist.spotify_id}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Artist;
