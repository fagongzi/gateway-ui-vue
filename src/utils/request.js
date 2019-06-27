/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import axios from 'axios'
import { Message } from 'element-ui'

const baseUrl = process.env.VUE_APP_BASE_URL || ''
const apiPath = process.env.VUE_APP_BASE_API || '' // 本地代理才能使用到的
const apiVersion = apiPath + '/v1'

const service = axios.create({
  baseURL: baseUrl + apiVersion, // api的base_url
  timeout: 60 * 1000 // request timeout 60s
})

// request interceptor
service.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.error(error) // for debug
  Promise.reject(error)
})

service.interceptors.response.use(response => {
  const res = response.data || {}
  const headers = response.headers || {}

  if (res.code === 0) {
    return res.data
  } else {
    Message({
      message: res.data,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject('error')
  }
}, error => {
  Message({
    message: error.data || '网络异常',
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default service
