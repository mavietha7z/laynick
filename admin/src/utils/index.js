import axios from "axios";

const request = axios.create({
    baseURL: "https://localhost:4040/api",
    withCredentials: true,
});

export default request;
