
import axios from "axios";

export const BASE_URL = "https://linkdin-clone-1-chn3.onrender.com"

export const clientServer = axios.create({
    baseURL: BASE_URL,
});