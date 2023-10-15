import React, { useState, createContext } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const MyContext = createContext();

const ContextProvider = (props) => {
  const [loading, setLoading] = useState(cookies.get("auth-token"));
  const [user, setUser] = useState(null);

  const contextValues = { user, setUser, loading, setLoading };

  return (
    <div>
      <MyContext.Provider value={contextValues}>
        {props.children}
      </MyContext.Provider>
    </div>
  );
};

export default ContextProvider;
