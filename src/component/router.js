import React from "react";
import Home from "./home";
import Detail from "./detail";
import Header from "./header";
import Filter from "./filter";
import { BrowserRouter,Switch, Route } from "react-router-dom/cjs/react-router-dom";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        
        <Route exact path="/details" component={Detail} />
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/filter" component={Filter} /> {/* Corrected the path prop */}
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
