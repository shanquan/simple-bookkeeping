<template>
  <div class="bill">
    <el-form 
      :model="form" 
      v-loading="loading"
      label-position="right" 
      label-width="80px">
      <el-form-item label="类型">
        <el-select v-model="form.type" placeholder="类型" @change="form.category=''">
          <el-option v-for="(tp,index) in types" :key="index" :label="tp" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          ref="catSelect"
          v-model="form.category" 
          placeholder="分类" 
          clearable
          filterable
          allow-create>
          <el-option v-for="(cat,index) in categories" :key="index" :label="cat.name" :value="cat.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额">
        <el-input-number v-model="form.amount" :step="10"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!form.amount" @click="onSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'bill',
  data(){
    return{
      loading:false,
      form:{
        type: 0,
        category:"",
        amount:0
      }
    }
  },
  created(){
    if(this.$route.params.id!="new"){
      // edit mode
      this.form = this.$store.state.bills.find(it=>it.id==this.$route.params.id);
    }
  },
  computed:{
    types(){
      return this.$store.state.types
    },
    categories(){
      return this.$store.state.categories.filter(it=>it.type==this.form.type)
    }
  },
  methods:{
    generateRandom(randomFlag, min, max){
      var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      // 随机产生
      if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
      }
      for(var i=0; i<range; i++){
        var pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
      }
      return str;
    },
    onSubmit(){
      let bill={};
      this.loading = true;
      this.$http.postBill(this.form).then((res)=>{
        this.loading = false;
        if(this.$http.mode!=1){
          // if can't find category in global sets
          if(this.form.category && !this.$store.state.categories.find(it=>it.name==this.form.category||it.id==this.form.category)){
            let category = {
              "id": this.generateRandom(false,10),
              "type": this.form.type,
              "name": this.form.category
            }
            this.$store.commit('addCategory',category);
            this.form.category = category.id;
            if(this.$http.mode==0){
              this.$http.saveLocal("categories",this.$http.jsonTocsv(this.$store.state.categories));
            }
          }
          if(this.$route.params.id!="new"){
            Object.assign(bill,this.form)
          }else{
            Object.assign(bill,this.form,{
              "id": this.$store.state.bills.length,
              "time": (new Date()).toJSON()
            })
          }
        }else{
          // for online, the server should return bill data, use server data to commit $store
          // suppose res={"bill":{},"category":{}}
          if(res.category){
            // server generated new category
            this.$store.commit('addCategory',res.category);
          }
          bill = res.bill;
        }
        this.$store.commit('editBill',bill);
        if(this.$http.mode==0){
          // this.$nextTick(()=>{
            let bills  = this.$store.state.bills.map(it=>{
              let item = {
                time: Date.parse(it.time),
                id: it.id,
                type: it.type,
                category: it.category,
                amount: it.amount
              }
              return item;
            })
            this.$http.saveLocal("bills",this.$http.jsonTocsv(bills));
            this.$router.push({path:"/"});
          // })
        }else{
          this.$router.push({path:"/"});
        }
      })
    }
  }
}
</script>
<style>
.bill .el-form{width:400px;margin:0 auto}
</style>