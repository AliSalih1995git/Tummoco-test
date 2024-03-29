import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  console.log(process.env.REACT_APP_BACKEND_URL, "backendURL");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchAllCities = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/getAllCities`
      );
      setCities(res.data);
    };
    fetchAllCities();
  }, []);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };
  console.log(selectedCity, "selectedCity");
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        {
          username,
          email,
          city: selectedCity,
          password,
        }
      );
      const { user, message } = res.data;
      console.log(res.data, "RESPONSE");
      dispatch({ type: "REGISTER", payload: { user } });
      toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-rose-100 to-teal-100 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div class="max-w-md mx-auto">
            <div>
              <h1 class="text-2xl font-semibold">Sign Up</h1>
            </div>
            <form onSubmit={handleSignup}>
              <div class="divide-y divide-gray-200">
                <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div class="relative">
                    <input
                      autocomplete="off"
                      id="usename"
                      name="usename"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      class="placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Usename"
                    />
                    <label
                      for="usename"
                      class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Username
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Email address"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <select
                      id="city"
                      name="city"
                      value={selectedCity}
                      onChange={handleCityChange}
                      className="block w-full h-10 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 appearance-none"
                      placeholder="Username"
                    >
                      <option value="" disabled selected hidden>
                        Choose an option
                      </option>
                      {cities &&
                        cities.map((city) => (
                          <option key={city._id} value={city._id}>
                            {city.cityName}
                          </option>
                        ))}
                    </select>
                    <label
                      htmlFor="city"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      City
                    </label>
                  </div>

                  <div class="relative">
                    <input
                      autocomplete="off"
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      class="placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Password"
                    />
                    <label
                      for="password"
                      class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div class="relative">
                    <button
                      type="submit"
                      class="bg-blue-500 hover:bg-blue-700 text-white rounded-md px-2 py-1"
                    >
                      Submit
                    </button>
                  </div>
                  <div class="relative">
                    <span>
                      Already have an account? <Link to="/login">Log In</Link>
                    </span>
                  </div>
                  <div className="relative">
                    {error && (
                      <span className="text-red-600">
                        Wrong Email/password! Try different Ones
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
