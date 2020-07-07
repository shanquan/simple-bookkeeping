import axios from 'axios'
import { Message } from 'element-ui'

axios.defaults.baseURL = '/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// mode define
// 0:local; 1:online; 2:online with mock data;
let mode = 2;
if (mode == 2) {
    axios.defaults.baseURL = '/mock/';
    axios.interceptors.request.use(function(config) {
        if (config.url == "bills" || config.url == "categories") {
            config.url = config.url.replace(/\//g, "") + '.csv';
        } else {
            config.url = 'default.json';
        }
        config.method = 'get';
        return config;
    })
}

axios.interceptors.response.use(response => {
        if (response.data.code) {
            Message.error('code:' + response.data.code + ',message:' + response.data.message);
            return Promise.reject(response.data);
        } else {
            return response.data;
        }
    },
    function(error) {
        Message.error('code:0,message:' + error.toString());
        return Promise.reject({
            code: 0,
            message: error
        });
    });

export default {
    mode,
    getBills(month) {
        if(this.mode==0){
            // load data from localStorage, but IndexDB is better
            let promise = new Promise(function(reslove,reject){
                try{
                    let bills = localStorage.getItem('bills');
                    if(bills){
                        reslove(bills);
                    }
                }catch(e){
                    Message.error("load bills error:"+ e.toString());
                    reject("load bills error:"+ e.toString());
                }
            })
            return promise;
        }else{
            let promise = month?axios.get("bills",`month=${month}`):axios.get("bills");
            return promise;
        }
    },
    getCategories() {
        if(this.mode==0){
            // load data from localStorage
            let promise = new Promise(function(reslove,reject){
                try{
                    let categories = localStorage.getItem('categories');
                    if(categories){
                        reslove(categories);
                    }
                }catch(e){
                    Message.error("load categories error:"+ e.toString());
                    reject("load categories error:"+ e.toString());
                }
            })
            return promise;
        }else{
            let promise = axios.get("categories");
            return promise;
        }
    },
    postBill(data) { //data format: json
        if(this.mode==0)
        return new Promise(resolve=>resolve());
        let promise = axios.post("bill", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return promise;
    },
    deleteBill(id) { //data format: key1=value1&key2=value2
        if(this.mode==0)
        return new Promise(resolve=>resolve());
        let promise = axios.post("deleteBill", `id=${id}`);
        return promise;
    },
    csvTojson(str) {
        let jsonArr = str.split('\n');
        if(jsonArr.length){
            let keys = jsonArr[0].split(',')
            jsonArr = jsonArr.slice(1).map(it => {
                let jOb = {};
                for (let i in keys) {
                    let k = keys[i].trim();
                    if (k == "amount" || k == "type") {
                        jOb[k] = Number(it.split(',')[i].trim());
                    } else {
                        jOb[k] = it.split(',')[i].trim();
                    }
                }
                return jOb;
            })
        }
        return jsonArr;
    },
    jsonTocsv(jsonArr){
        let str = "";
        if(jsonArr.length){
            let fstLine = Object.keys(jsonArr[0]).join(',');
            str += fstLine + '\n';
            jsonArr.forEach(it=>{
                str += Object.values(it).join(',') + '\n';
            })
            str = str.substring(0,str.length-1);
        }
        return str;
    },
    saveLocal(tag,data){ // for localStorage Test
        localStorage.setItem(tag,data);
    }
}