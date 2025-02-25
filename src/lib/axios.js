import axios from 'axios'
 export const axiosInstance = axios.create({
    //Backup For render
    // baseURL: "https://chit-chat-bac.up.railway.app/api",
    baseURL: "https://backend-v0ob.onrender.com/api",
    withCredentials:true,
 })
