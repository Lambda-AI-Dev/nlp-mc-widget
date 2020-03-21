import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return <div>This is a React component inside of webflow!!</div>;
};

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById("react-target")
);
