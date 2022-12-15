import React from "react";
import ReactDom from "react-dom/client";
import Artists from "./components/Artists";

const root = ReactDom.createRoot(document.getElementById("spotify-artists"));

root.render(<Artists />);
