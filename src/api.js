import Vue from 'vue'
import axios from 'axios'


const client = axios.create({
  baseURL: 'http://localhost:8081/',
  json: true
})

Vue.prototype.$http = client ;



export default {
    async execute (method, resource, data, id, topic) {
    
        return client({
          method,
          url: resource,
          data,
          topic,
          id,
          headers: {
      
           }
        }).then(req => {
          return req.data
        })
      },
    getPoints (url) {
    return this.execute('get', '/points')
  },
  createPoint (data) {
   return this.execute('post', '/points', data)
  },
  CalcPoint(data){
    return this.execute('post', '/points', data)
  },
  updatePoint (id, data) {
    return this.execute('put', `/points'/${id}`, data)
  },
  deletePoint (id) {
    return this.execute('delete', `/points/${id}`)
  },
  deletePoints ( data) {
    return this.execute('delete', `/points/}`, data)
  },
  getClusters (url) {
    return this.execute('get', '/clusters')
  },
  createCluster (data) {
   return this.execute('post', '/clusters', data)
  },
  getTopics (url) {
    return this.execute('get', '/Topics')
  },
  createTopic (data) {
   return this.execute('post', '/Topics', data)
  },
  getWaves (url) {
    return this.execute('get', '/waves')
  },
}