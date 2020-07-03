import axios from 'axios'
import {Message} from 'element-ui'

axios.defaults.baseURL = '/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// mock service
let mock = true;
if(mock){
  axios.defaults.baseURL = '/mock/';
  axios.interceptors.request.use(function (config) {
    if(config.url=="bills"||config.url=="categories"){
      config.url = config.url.replace(/\//g,"")+ '.csv';
    }else{
      config.url = 'default.json';
    }
    config.method = 'get';
    return config;
  })
}

axios.interceptors.response.use(function (response) {
  if(response.data.code){
    Message.error('code:' + response.data.code + ',message:' + response.data.message);
    return Promise.reject(response.data);
  }else{
    return response.data;
  }
},
function (error) {
  Message.error('code:0,message:' + error.toString());
  return Promise.reject({
    code: 0,
    message: error
  });
});

export default{
  mock,
  getBills(){
    let promise = axios.get("bills");
    return promise;
  },
  getCategories() {
    let promise = axios.get("categories");
      return promise;
  },
  postBill(data){//data format: json
    let promise = axios.post("bill",data,{
      headers:{
        'Content-Type': 'application/json'
      }
    });
    return promise;
  },
  deleteBill(id){//data format: key1=value1&key2=value2
    let promise = axios.post("deleteBill",`id=${id}`);
    return promise;
  },
  csvTojson(str){
    let jsonObj = str.split('\n');
    let keys = jsonObj[0].split(',')
    jsonObj = jsonObj.slice(1).map(it=>{
      let jOb={};
      for(let i in keys) {
        let k = keys[i].trim();
        if(k=="amount"||k=="type"){
          jOb[k] = Number(it.split(',')[i].trim());
        }else{
          jOb[k] = it.split(',')[i].trim(); 
        }
      }
      return jOb;
    })
    return jsonObj;
  }
}