import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// CSS
import "./LogIn_Desktop.css";
// icons
import { GoogleOutlined, GithubFilled } from "@ant-design/icons";
// Context
import { MyContext } from "../../contexts/AuthContext";
// firebase
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, gitHubProvider } from "./firebase";
// cookies
import Cookies from "universal-cookie";
const cookies = new Cookies();

const LogIn = () => {
  const { user, setUser, loading, setLoading } = useContext(MyContext);

  const navigate = useNavigate();

  const onClickGoogleAuthButton = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      cookies.set("auth-token", result.user.refreshToken);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickGitHubAuthButton = async () => {
    try {
      const result = await signInWithPopup(auth, gitHubProvider);
      cookies.set("auth-token", result.user.refreshToken);
    } catch (error) {
      console.log(error);
    }
  };

  const isUserAuthenticatedAlready = () => {
    auth.onAuthStateChanged((user) => {
      setLoading(false);
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
