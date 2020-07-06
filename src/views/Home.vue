<template>
  <div class="home">
    <el-form :inline="true" label-position="right" :model="form" class="form-bar">
        <el-form-item label="月份">
          <el-date-picker
            v-model="month"
            type="month"
            :picker-options="{disabledDate:(dm)=>{
              return dm>new Date()
            }}"
            value-format="yyyy-MM"
            placeholder="月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="类型" :disabled="form.category!=''" clearable class="w80" @change="form.category=''">
            <el-option v-for="(tp,index) in types" :key="index" :label="tp" :value="index.toString()"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="分类" clearable @change="setType()">
            <el-option v-for="(cat,index) in categories" :key="index" :label="cat.name" :value="cat.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!month&&form.category&&!bills.length">
          <el-button type="text" @click="delCategory()">删除分类</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="tab">
        <el-tab-pane label="明细">
          <el-table
          :data="bills"
          stripe
          :default-sort="defaultSort"
          style="width: 100%">
          <el-table-column
            prop="time"
            sortable
            label="时间">
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="类型" width="80">
          </el-table-column>
          <el-table-column
            prop="catName"
            label="分类">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="金额">
            <template slot-scope="scope">
              {{scope.row.amount | fixed2}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle  @click.native.prevent="editBill(scope.$index,scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle  @click.native.prevent="delBill(scope.$index,scope.row)"></el-button>
            </template>
          </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="统计">
          <statistic :month="month" :category="form.category" :type="form.type" :expend="expend" :income="income" :categories="categories" :bills="bills"></statistic>
        </el-tab-pane>
        <el-tab-pane :label="sumLabel" disabled></el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import Statistic from '@/components/Statistic.vue'

export default {
  name: 'home',
  components:{
    Statistic
  },
  created(){
    try{
      if(!this.$store.state.categories.length)
      this.$http.getCategories().then(response=>{
        // this.$http.saveLocal('categories',response); // for localStorage init
        this.$store.commit('initCategories',this.$http.csvTojson(response));
        // normally fetch bills by month
        return this.$http.getBills();
      }).then(res=>{
        // this.$http.saveLocal('bills',res); // for localStorage init
        let bills = this.$http.csvTojson(res).map((it,idx)=>{
          it.id = idx;
          it.time = new Date(Number(it.time)).toJSON();
          return it;
        })
        this.$store.commit('initBills',bills);
      });
    }catch(e){
      this.$message.error('账单数据加载异常：'+e.toString());
    }
  },
  computed:{
    types(){
      return this.$store.state.types
    },
    categories(){
      return this.$store.state.categories.filter(it=>this.form.type==""||it.type==this.form.type)
    },
    bills(){
      try{
        return this.$store.state.bills.filter(it=>{
          let monthMatch = !this.month||it.time.substring(0,7)==this.month;
          let typeMatch= this.form.type==""||this.form.type==it.type;
          let catMatch = this.form.category==""||this.form.category==it.category;
          return monthMatch&&typeMatch&&catMatch;
        }).map(it=>{
          let category = this.$store.state.categories.find(el=>{
            return el.id==it.category
          });
          return Object.assign({},it,{
            time: it.time.substring(0,10),
            typeName: this.types[it.type],
            catName: category?category.name:""
          })
        })
      }catch(e){
        // console.log(e);
        return [];
      }
    },
    expend(){
      let expend=0
      this.$store.state.bills.filter(it=>{
        let monthMatch = !this.month||it.time.substring(0,7)==this.month;
        return monthMatch&&it.type=="0";
      }).forEach(it=>{
        expend += it.amount;
      })
      return expend;
    },
    income(){
      let income = 0;
      this.$store.state.bills.filter(it=>{
        let monthMatch = !this.month||it.time.substring(0,7)==this.month;
        return monthMatch&&it.type=="1";
      }).forEach(it=>{
        income += it.amount;
      })
      return income;
    },
    sumLabel(){
      let prefix = this.month?this.month:"汇总";
      return `${prefix} 支出：${this.expend} | 收入：${this.income} | 盈余：${this.income-this.expend}`;
    }
  },
  data(){
    return{
      tab: "0",
      month: "", // default: this.todayMonth()
      form:{
        category:"",
        type:""
      },
      defaultSort:{
        "prop":"time",
        "order":"descending"
      }
    }
  },
  methods:{
    todayMonth(){
      let td = new Date();
      let month = td.getMonth()+1;
      month = month.toString().length==1?'0'+month:month;
      return td.getFullYear()+'-'+month
    },
    setType(){
      if(this.form.category==""){
        this.form.type = ""
      }else{
        this.form.type = this.$store.state.categories.find(it=>it.id==this.form.category).type.toString();
      }
    },
    editBill(idx,item){
      this.$router.push({ path: `bill/${item.id}`})
    },
    delBill(idx,item){
      this.$confirm("请确认是否删除？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.deleteBill(item.id).then(()=>{
          this.$store.commit('deleteBill',item);
          if(this.$http.mode==0){
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
          }
        })
      })
    },
    delCategory(){
      this.$confirm("该分类下无账单，是否删除分类？", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('deleteCategory',this.form.category);
        this.form.category = "";
        this.$http.saveLocal("categories",this.$http.jsonTocsv(this.$store.state.categories));
      })
    }
  }
}
</script>

<style>
.home .el-tabs__item.is-disabled{color:#444}
.form-bar{padding-top: 20px;
    padding-left: 10px;
    background-color: #f2f2f2;}
.w80{width:80px}
</style>