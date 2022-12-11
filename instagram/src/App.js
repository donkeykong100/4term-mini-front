import React from "react";
import { Route, Routes } from "react-router-dom";
import { injectGlobal } from "@emotion/css";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import MainPage from "./pages/MainPage";
import Explore from "./pages/Explore";
import UserPage from "./pages/UserPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import PostPage from "./pages/PostPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/explore" element={<Explore />}></Route>
      <Route path="/main" element={<MainPage />}></Route>
      <Route path="/:nickname" element={<UserPage />}></Route>
      <Route path="/edit" element={<ProfileEditPage />}></Route>
      <Route path="/p/:postNo" element={<PostPage />}></Route>
    </Routes>
  );
}
injectGlobal`
  * {
    margin: 0;
    padding: 0;
    outline: none;
    border: none;
    box-sizing: border-box; 
  }
  textarea {
    resize: none;
  }
  button {
    cursor: pointer;
    background-color: inherit;
  } 
  ul {
    list-style: none;
  }
  li {
    list-style:none;
  }
  a, a:visited, a:link {
    color: inherit;
    text-decoration: none;
  }
`;

export default App;
