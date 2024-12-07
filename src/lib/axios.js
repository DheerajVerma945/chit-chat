import axios from 'axios'
 export const axiosInstance = axios.create({
    baseURL: "https://chit-chat-bac.up.railway.app/api",
    withCredentials:true,
 })