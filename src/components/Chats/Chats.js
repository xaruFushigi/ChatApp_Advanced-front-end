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
      const response = await fetch("https://api/chatengine.io/users/me", {
        headers: {
          "Content-Type": "application.json",
          projectId: "4a0d31c3-f8d9-401e-82d4-ecb7552e1ed1",
          "user-name": user.email,
          "user-secret": user.uid,
        },
      });
      if (response.ok) {
        setLoading(false);
      }
    } catch (error) {
      let formdata = new FormData();
      formdata.append("email", user.email);
      formdata.append("username", "user.displayName");
      formdata.append("secret", user.uid);
      getFile(user.photoURL).then(async (avatar) => {
        formdata.append("avatar", avatar, avatar.name);
        const response = await fetch("https://api.chatengine.io/users", {
          method: "POST",
          body: JSON.stringify({
            formdata,
          }),
          headers: {
            "Content-Type": "application/json",
            "private-key": "d8cee68d-5cc2-4bd2-b860-e70c83261660",
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

  //   if (!user || loading) {
  //     return "loading...";
  //   }
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
        projectID="4a0d31c3-f8d9-401e-82d4-ecb7552e1ed1"
        username="llfgjrvzm@mozmail.com"
        userSecret="5FgcCalpxFWUZ0SMBRdgmbxk2BS2"
      />
    </div>
  );
};

export default Chats;
