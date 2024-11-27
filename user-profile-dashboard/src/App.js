import React from "react";
import ProfilePage from "./pages/ProfilePage";
import styled from "styled-components";
import "./App.css";

const StayledText = styled`
font-family: 'Roboto', sans-serif;
font-width: 400`

function App() {
  return (
    <div>
      <ProfilePage/>
    </div>
  );
}

export default App;