import React, { useRef } from "react";

const FetchForm = (props) => {
  const getArtist = props.onClick;
  const inputRef = useRef(null);

  return (
    <div className="fetch-form">
      <label htmlFor="artist-id"></label>
      <input ref={inputRef} id="artist-id" type="text" name="artist-id"></input>
      <button
        onClick={() => {
          getArtist(inputRef.current.value);
          inputRef.current.value = "";
        }}
      >
        Fetch
      </button>
    </div>
  );
};

export default FetchForm;
