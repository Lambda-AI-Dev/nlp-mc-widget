import React from "react";
import ReactDOM from "react-dom";
import { DatePicker } from "antd";

const App = () => {
  return (
    <div>
      <h1>hello world</h1>
      This is a React component inside of webflow!! DatePicker should be
      displayed here:
      <DatePicker />
    </div>
  );
};

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById("react-target")
);
