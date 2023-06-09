import { legacy_createStore as createStore } from "redux";

const initialState = {
  user: null,
  token: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "REGISTER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
      };
    case "LOGOUT":
      localStorage.removeItem("userInfo");

      return {
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
