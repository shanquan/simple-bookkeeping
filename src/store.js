import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    types:['支出','收入'],
    categories:[],
    bills:[]
  },
  mutations: {
    initCategories(state,cats){
      state.categories = cats;
    },
    initBills(state,bills){
      state.bills = bills;
    },
    addCategory(state,category){
      state.categories.push(category);
    },
    editBill(state,bill){
      let idx = state.bills.findIndex(it=>{
        return it.id == bill.id
      })
      if(idx!=-1){
        Object.assign(state.bills[idx],bill);
      }else{
        state.bills.push(bill);
      }
    },
    deleteBill(state,bill){
      let idx = state.bills.findIndex(it=>{
        return it.id == bill.id
      })
      if(idx!=-1)
      state.bills.splice(idx,1);
    }
  }
})
