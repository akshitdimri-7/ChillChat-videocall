import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import server from "../environment.js";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${server}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

  const navigate = useNavigate();

  const handleRegister = async (name, username, password) => {
    try {
      const response = await client.post("/register", {
        name,
        username,
        password,
      });
      if (response.status === httpStatus.CREATED) {
        return response.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await client.post("/login", {
        username,
        password,
      });

      if (response.status === httpStatus.OK) {
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.user);
        navigate("/home");
      }
    } catch (error) {
      throw error;
    }
  };

  const getHistoryOfUser = async () => {
    try {
      let request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data;
    } catch (err) {
      throw err;
    }
  };

  // const getHistoryOfUser = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.log("No token found");
  //       return []; // Return empty array if no token
  //     }

  //     const request = await client.get("/get_all_activity", {
  //       params: { token },
  //     });
  //     console.log("API response:", request.data); // Debug log
  //     return request.data || []; // Return empty array if no data
  //   } catch (err) {
  //     console.error(
  //       "getHistoryOfUser error:",
  //       err.response?.data || err.message
  //     );
  //     return []; // Always return array, never throw
  //   }
  // };

  const addToUserHistory = async (meetingCode) => {
    try {
      let request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      return request;
    } catch (e) {
      throw e;
    }
  };

  const data = {
    userData,
    setUserData,
    addToUserHistory,
    getHistoryOfUser,
    handleRegister,
    handleLogin,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
