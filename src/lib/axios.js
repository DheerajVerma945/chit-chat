import axios from 'axios'
 export const axiosInstance = axios.create({
   //  baseURL: "https://chit-chat-bac.up.railway.app/api",
    //Backup For railway
    baseURL: "https://backend-v0ob.onrender.com/api",
    withCredentials:true,
 })
