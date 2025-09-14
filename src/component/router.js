import React from "react";
import Home from "./home";
import Detail from "./detail";
import Header from "./header";
import Filter from "./filter";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Router() {
  console.log("first");
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/details" element={<Detail />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/filter" element={<Filter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;