import axios from 'axios'
import { API_BASE_URL } from '@/global/consts/api.consts'

const instance = axios.create({
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
  baseURL: API_BASE_URL,
  timeout: 60000,
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
