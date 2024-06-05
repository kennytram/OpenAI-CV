import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Main from "./pages/Main";
import { GoogleLogin } from "@react-oauth/google";
import { gapi } from "gapi-script";
import "./App.css";

function App() {
  const [userData, setUserData] = useState<any>(null);
  const loginText = "Login to scan CV with OpenAI";

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID_URL,
        scope: "openid profile email",
      });
    }

    const token = getToken();

    if(token && !userData) {
      decodeResponse(token);
    }

    gapi.load("client:auth2", start);
  }, []);

  const getToken = (): string | null => {
    return sessionStorage.getItem('authToken');
  };

  const setToken = (token: string) => {
    sessionStorage.setItem('authToken', token)
  }

  const decodeResponse = (response: any) => {
    const decoded = jwtDecode(response?.credential);
    setUserData(decoded);
  }

  const handleLoginSuccess = (response: any) => {
    decodeResponse(response);
    setToken(response);

    // axios
    //   .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json`, {
    //     headers: {
    //       Authorization: `Bearer ${response.credential.access_token}`,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     setUserData(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const handleLoginFailure = () => {
    console.log("Login Failed");
  };

  return (
    <>
      <>
        {(() => getToken) ? (
          <>
            <div className="googleLogin">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                type="icon"
              />
            </div>
            <BrowserRouter>
              <Switch>
                <Route path="/" element={<Main />} />
              </Switch>
            </BrowserRouter>
          </>
        ) : (
          <div className="googleNotLogin">
            <div className="loginText">{loginText}</div>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              size="medium"
            />
          </div>
        )}
      </>
    </>
  );
}

export default App;
