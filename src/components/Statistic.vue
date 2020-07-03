<template>
  <div class="statistic">
    <doughnut-chart v-if="bills.length" class="chart" :chart-data="chartData"></doughnut-chart>
    <div v-else class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
    <div v-if="bills.length&&this.type!=''">排行榜</div>
    <el-table
      v-if="bills.length&&this.type!=''"
      :data="rankData"
      :show-header="false"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="label">
      </el-table-column>
      <el-table-column
        property="data">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import DoughnutChart from '@/plugins/DoughnutChart.js'

export default {
  name: 'Statistic',
  components:{
    DoughnutChart
  },
  props: {
    month: String,
    category: String,
    type: String,
    expend: Number,
    income: Number,
    categories: Array,
    bills: Array
  },
  data () {
    return {}
  },
  computed:{
    chartData(){
      let chartData = {
        labels: [],
        datasets: [{
          label: 'Data One',
          backgroundColor: ['rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgb(232, 144, 144,1)',
              'rgba(103, 194, 58, 1)'],
          data: []
        }]
      };
      if(this.type==""){
        chartData.labels = ["支出","收入"];
        chartData.datasets[0].data = [this.expend,this.income];
      }else if(this.category==""){
        let rankData = this.rankData;
        rankData.forEach(it=>{
          chartData.labels.push(it.label);
          chartData.datasets[0].data.push(it.data);
        });
      }else{
        chartData.labels = [this.categories.find(it=>it.id==this.category).name];
        chartData.datasets[0].data = [this.bills.reduce((sum,current)=>{
          sum += current.amount
          return sum;
        },0)];
      }
      return chartData;
    },
    rankData(){
      if(this.bills.length&&this.type!=''&&this.category==""){
        let rankData = this.categories.map(it=>{
          return {
            "label":it.name,
            "data": this.bills.reduce((sum,current)=>{
              if(current.category==it.id){
                sum += current.amount
              }
              return sum;
            },0)
          }
        });
        rankData = rankData.sort((a,b)=>{return b.data-a.data}).filter(it=>it.data!=0);
        return rankData;
      }else if(this.bills.length&&this.category!=""){
        return this.bills.map(it=>{return {
           "label": it.time,
            "data": it.amount
          }
        }).sort((a,b)=>b.data-a.data);
      }
      return [];
    }
  },
  methods: {
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart{width:50%;max-width:300px;margin:0 auto}
</style>
