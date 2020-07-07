# simple-bookkeeping 简易记账本

## Introduction
本项目是按照[xmindltd/hirin](https://github.com/xmindltd/hiring/tree/master/frontend-1)要求提交的作业，请访问[vercel部署站点](https://simple-bookkeeping.vercel.app/)快速查看demo，运行离线版本：<https://simple-bookkeeping.vercel.app/?mode=0>

支持三种模式运行，参见`http.js`中的`mode`定义：(默认开发模式)
1. 离线模式(mode=0)：使用localStorage保存csv数据，刷新后数据不会丢失。localStorage对数据量有限制，账单bills的保存改为indexDB存储更优
2. 在线模式(mode=1): 使用`http.js`中的API接口处理数据，需要后端开发相关接口后才能使用
3. 开发模式(mode=2)：将从`/mock`文件夹下取csv或json文件作为模拟数据，刷新后新增数据无法保存

To Be Done
- [x] vercel.com(formerly ZEIT) Deploy
- [x] delete a category if no bills are related to it
- [x] add localstorage to support offline mode(low priority)
- [ ] auto generate chart backgroundColor (low priority)
- [ ] export to csv files (not sure yet, maybe need a backend server)
- [ ] API swaggle file (low priority)

## Environment

Node.js：`^v12.16.1`, 请使用v12以上版本，如`yarn`未安装使用`npm`命令即可

## Project setup
```
yarn install
# or
npm install
```

### Compiles and hot-reloads for development
```
yarn run serve
# or
npm run serve
```

### Compiles and minifies for production
```
yarn run build
# or
npm run build
```

### Lints and fixes files
```
yarn run lint
# or
npm run lint
```

### 项目说明

除题目需求外附加以下功能：
1. 新增账单时，category支持用户自定义输入，并同时新增一项category
2. 账单可以编辑和删除
3. 账单查询（未选择月份，选择其中一个category）时，假如查询无数据，则自动显示一个删除按钮，点击可以删除分类下账单数据为空的category（这个功能隐藏的比较深，因为懒得再单独写个页面了，又觉得category删除功能也有必要实现下）
4. 账单可以根据筛选条件进行收支统计、支出统计与排名、收入统计与排名、类型统计排名（既然支出统计都做了，其他分类统计也顺便做了吧）
5. 数据层支持三种模式，参见`http.js`中的`mode`字段定义，`mode=0`时使用localstorage离线模式，`mode=1`时使用在线API，`mode=2`时使用`mock/`文件夹下的模拟数据文件(csv or json)

开发过程中遇到问题及解题思路：
1. 加载csv文件
   
   之前一直都有用模拟接口加载json文件，csv没试过于是尝试用加载json文件的方法加载csv文件，发现也行。于是就采用将两个csv文件放入`public/mock` 文件夹下，通过`$http`加载并进行解析处理成JS更容易处理的json格式。

   遇到一个小问题，csv格式`time`字段多了一个空格，导致数据未出来，处理的时候加了`trim()`就OK了
2. 在线模式的API接口设计

    设计的时候会考虑到后台的数据实现，以及API相关接口，详见`http.js`文件中的定义。即使不考虑多用户系统，bills数据也缺少了一个uuid, 于是处理csv时自动为`bills`中的数据添加了Integer类型的id
3. 分类二次筛选
   
   由于开始对分类和类型数据模型之间的关系没有分析清楚，做二次分类筛选时觉得查询条件会有冲突，后来理了下，添加了分类和收支类型之间到关联选择逻辑：
   - 收支类型选择后，仅显示属于该类型到分类列表；
   - 收支类型变化后，重置分类列表让用户重选；
   - 如分类有值，则收支类型自动变为分类所属到类型，且不能修改，除非先清空分类

4. 初始数据加载优化
   
   初始数据目前是在`Home.vue`的`created`加载，其他页面缺少初始数据会出现异常，所以新增全局前置守卫，如果初始数据(bills,category)未获取则自动跳转首页

   由于`router.beforeEach`中组件还未创建，也不能访问组件实例，办法一是创建一个`boolean`全局变量`window.INITED`，初始值`false`，`Home.vue`组件中获取数据后改为`true`。每次导航前置判断如果`INITED`值为`false`就导航至`router home`

   不过好像项目默认`eslintConfig`对全局变量会报错，所以暂时通过`from.name`判断是否首次加载，如果是首次加载且不是首页，则自动先跳转首页。

5. 新增category处理优化
   
   如果支持用户自定义category功能，最简单的办法就是设置`el-select`组件`allow-create`，但是由于新增账单时，如果category是用户新增，则需要同时创建一条category记录，所以需要能区分`this.form.category`是新增值还是选择已有值的情况。
   
   我去查`el-select`提供的公开配置、方法和事件，发现并没有提供相关的`Event`, 也通过设置组件ref并查看其Virtual Dom的属性数据，也没有。初步估计解决这个问题可能需要修改`el-select`源码，所以暂时只能通过遍历categories数据判断`this.form.category`是否已存在，如不存在则表示新增。

   参考支付宝-记账本的分类标签选择和添加功能，假如不使用`el-select`组件，改为`el-tag`标签选项和动态编辑的交互模式，应该不会存在这种问题，而且用户体验更优。

6. 数组`map`方法问题
   
   `Home.vue`中因为对`computed.bills`的map处理没有注意，导致`this.$store.state.bills`数组被改变，计算属性刷新时报错导致查询不到数据，按照方式二修改后正常，在离线模式中处理`jsonTocsv`的时候也需要注意。

   方式一：会改变原数组bills
   ```
   let arr = bills.map(it=>{
      it.time = it.time.subString(0,10);
      it.catName = '';
      delete it.catName;
      return it
   })
   ```

   方式二：不会改变原数组bills
   ```
   let arr = bills.map(it=>{
      return Object.assign({},it,{
         time: it.time.subString(0,10)
      })
   })
   ```

7. vercel.com集成github后不能自动部署
   
   因为之前安装Vercel（Now）应用的时候，Repository access给的权限是Only select repositories，所以需要依次访问github-settings-Applications-Installed Github Apps-Configure Vercel,添加应用repo的访问权限后，再次提交即可自动部署
   
   