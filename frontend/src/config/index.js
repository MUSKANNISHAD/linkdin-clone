import axios from "axios";

export const BASE_URL = "https://linkdin-clone-yh6f.onrender.com";

export const clientServer = axios.create({
    baseURL: BASE_URL,
});