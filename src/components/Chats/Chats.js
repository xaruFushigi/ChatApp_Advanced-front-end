import React, { useContext, useRef, useEffect, useState } from "react";
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

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };

  const makeRequestToChatEngine = async () => {
    try {
      const response = await fetch("https://api.chatengine.io/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          projectId: "13a8bd44-cd1a-4b29-b01f-ce385b9eda03",
          "user-name": user.email,
          "user-secret": user.uid,
        },
      });
      if (response.ok) {
        setLoading(false);
      } else {
        let formdata = new FormData();
        formdata.append("email", user.email);
        formdata.append("username", "user.displayName");
        formdata.append("secret", user.uid);
        await getFile(user.photoURL).then(async (avatar) => {
          formdata.append("avatar", avatar, avatar.name);
          const response = await fetch("https://api.chatengine.io/users", {
            method: "POST",
            body: JSON.stringify({
              formdata,
            }),
            headers: {
              "Content-Type": "application/json",
              projectId: "13a8bd44-cd1a-4b29-b01f-ce385b9eda03",
              "user-name": user.email,
              "user-secret": user.uid,
              "private-key": "35c33b4d-99d6-4e5b-8dcb-0c09ea783b3d",
            },
          });
          if (response.ok) {
            setLoading(false);
          } else {
            console.log("nope");
            console.log(user.email);
          }
        });
      }
    } catch (error) {
      let formdata = new FormData();
      formdata.append("email", user.email);
      formdata.append("username", "user.displayName");
      formdata.append("secret", user.uid);
      await getFile(user.photoURL).then(async (avatar) => {
        formdata.append("avatar", avatar, avatar.name);
        const response = await fetch("https://api.chatengine.io/users", {
          method: "POST",
          body: JSON.stringify({
            formdata,
          }),
          headers: {
            "Content-Type": "application/json",
            projectId: "13a8bd44-cd1a-4b29-b01f-ce385b9eda03",
            "user-name": user.email,
            "user-secret": user.uid,
            "private-key": "35c33b4d-99d6-4e5b-8dcb-0c09ea783b3d",
          },
        });
        if (response.ok) {
          setLoading(false);
        } else {
          console.log("nope");
          console.log(user.email);
        }
      });
    }
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
        height="calc(100vh - 66px)"
        projectID="13a8bd44-cd1a-4b29-b01f-ce385b9eda03"
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
};

export default Chats;
