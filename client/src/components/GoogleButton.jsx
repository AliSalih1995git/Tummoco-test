import React, { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function GoogleButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleCallbackResponse(response) {
    let userObject = jwt_decode(response.credential);
    let user = {
      name: userObject.name,
      email: userObject.email,
    };
    let token = userObject.aud;
    console.log("Entered JWT token", userObject);
    dispatch({ type: "LOGIN", payload: { user, token } });
    navigate("/");
  }
  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID, "ID");
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);
  return <div id="signInDiv"></div>;
}

export default GoogleButton;
