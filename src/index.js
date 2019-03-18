import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store/index";
import Game from "./component/Game";

import "./styles.css";

function App() {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
