import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import State from "context/State";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
    <State>
        <Router>
            <App />
        </Router>
    </State>,
    document.getElementById("root")
);
