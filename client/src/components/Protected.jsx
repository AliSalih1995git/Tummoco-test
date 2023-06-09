import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Protected() {
  console.log("ENTER PROT");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userInfo");
    console.log(token);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/protected`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log(res, "PROTECTED");
      })
      .catch((err) => {
        console.log(err);
        navigate("/login");
      });
  }, []);

  return <div></div>;
}

export default Protected;
