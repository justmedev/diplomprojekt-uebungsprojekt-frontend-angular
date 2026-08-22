import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  allowAbsoluteUrls: false,
  adapter: 'fetch',
  timeout: 5000,
})

export default api

