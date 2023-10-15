import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOutlined, GithubFilled } from "@ant-design/icons";
import { MyContext } from "../../contexts/AuthContext";
import {
  GithubAuthProvider,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "./firebase";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const LogIn = () => {
  const { user, setUser, loading, setLoading } = useContext(MyContext);
  //   const [loading, setLoading] = useState(cookies.get("auth-token"));
  //   const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const onClickGoogleAuthButton = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      console.log(result.user);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickGitHubAuthButton = () => {
    signInWithRedirect(auth, new GithubAuthProvider());
  };

  const isUserAuthenticatedAlready = () => {
    auth.onAuthStateChanged((user) => {
      setLoading(false);
      console.log("Auth state changed. User:", user);
      if (user) {
        setUser(user);
        navigate("/chats");
      }
    });
  };

  useEffect(() => {
    isUserAuthenticatedAlready();
  }, [user, navigate]);
  return (
    <div id="login-page">
      {!loading && (
        <div id="login-card">
          <h2>Welcome to ChatApp</h2>
          <div
            className="login-button google"
            onClick={onClickGoogleAuthButton}
          >
            <GoogleOutlined /> Sign In with Google
          </div>
          <br /> <br />
          <div
            className="login-button github"
            onClick={onClickGitHubAuthButton}
          >
            <GithubFilled /> Sign In with Github
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn;
