import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FileUploadForm from "./FileUploadForm";

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [city, setCity] = useState("");

  // const urlParams = new URLSearchParams(window.location.search);
  // const token = urlParams.get("token");

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/user/${user.id}`
      );
      setCity(response.data.city.cityName);
    };

    fetchUser();
  }, []);
  return (
    <>
      <nav className="flex justify-around p-8 bg-gradient-to-r from-rose-300 to-teal-300  shadow-2xl">
        <h1 className="text-2xl font-semibold">
          <Link to="/"> Logo</Link>
        </h1>
        <span>
          {user ? (
            <p
              className=" cursor-pointer"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </p>
          ) : (
            <p>
              <Link to="/login"> Logo</Link>
            </p>
          )}
        </span>
      </nav>
      <div className="text-2xl h-screen bg-gradient-to-r from-rose-100 to-teal-100">
        <h4 className="m-6">Welcome,</h4>
        <div className="m-8">
          <h4>Name: {user.username}</h4>
          <h4> City: {city}</h4>
        </div>
        <div className="m-8 items-center">
          <FileUploadForm />
        </div>
      </div>
    </>
  );
}

export default Home;
