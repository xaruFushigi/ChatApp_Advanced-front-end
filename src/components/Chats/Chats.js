import React, { useContext, useRef, useEffect, useState } from "react";
import "./Chats_Desktop.css";
import "./Chats_Mobile_Portrait.css";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { MyContext } from "../../contexts/AuthContext";
import { auth } from "../LogIn/firebase";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Chats = () => {
  const navigate = useNavigate();
  const { user } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const onClickSignOutButton = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    navigate("/");
  };
  // env variables
  const projectId = process.env.PROJECT_ID;

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };

  const makeRequestToChatEngine = async () => {
    try {
      const response = await fetch("https://api.chatengine.io/users/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "PRIVATE-KEY": process.env.REACT_APP_PRIVATE_KEY,
        },
        body: JSON.stringify({
          username: user.email,
          secret: user.uid,
        }),
      });
      if (response.ok) {
        setLoading(false);
      } else {
        // User does not exist, create a new user
        const formdata = new FormData();
        formdata.append("username", user.displayName); // Fixed the username
        formdata.append("secret", user.uid);
        formdata.append("email", user.email);
        formdata.append("first_name", user.displayName);
        const avatar = await getFile(user.photoURL);
        formdata.append("avatar", avatar, avatar.name);
        formdata.append("project-id", "73ed9d82-e726-43ed-976c-7268f1d5e92a");

        const createUserResponse = await fetch(
          "https://api.chatengine.io/users/",
          {
            method: "POST",
            body: formdata,
            headers: {
              "PRIVATE-KEY": process.env.REACT_APP_PRIVATE_KEY,
            },
          }
        );

        if (createUserResponse.ok) {
          setLoading(false);
        } else {
          console.log(
            "Error creating user:",
            createUserResponse.status,
            createUserResponse.statusText
          );
          console.log(await createUserResponse.text());
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    makeRequestToChatEngine();
  }, [user, navigate]);

  if (!user) {
    return "loading...";
  }
  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">ChatApp</div>
        <div className="logout-tab" onClick={onClickSignOutButton}>
          Log Out
        </div>
      </div>
      <h1>Chats</h1>
      <ChatEngine
        height="calc(80vh)"
        projectID={process.env.REACT_APP_PROJECT_ID}
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
};

export default Chats;
