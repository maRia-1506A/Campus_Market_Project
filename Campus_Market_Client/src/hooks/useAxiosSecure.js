import axios from "axios";

// Simple axios instance for API calls
const axiosSecure = axios.create({
  baseURL: "http://localhost:5001",
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
