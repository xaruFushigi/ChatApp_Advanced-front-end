import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Chats from "./Chats"
import { LogIn, Chats } from "./components";

function App() {
  return (
    <div style={{ fontFamily: "Avenir" }}>
      <Router>
        <Routes>
          <Route path="/chats" exact element={<Chats />} />
          <Route path="/" exact element={<LogIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
