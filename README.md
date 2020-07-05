# simple-bookkeeping 简易记账本

## Introduction
本项目是按照[xmindltd/hirin](https://github.com/xmindltd/hiring/tree/master/frontend-1)要求提交的作业

To Be Done
- [ ] vercel.com(formerly ZEIT) Deploy
- [ ] category delete
- [ ] move init data fetch to global router.beforeResolve
- [ ] add localstorage and indexDB to support offline mode(low priority)
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
3. 账单查询（未选择月份，选择其中一个category）时，假如查询无数据，则自动显示一个删除按钮，点击可以删除分类下账单数据为空的category（To Be Done，这个功能隐藏的比较深，因为懒得再单独写个页面了，又觉得category删除功能也有必要实现下）
4. 账单可以根据筛选条件进行收支统计、支出统计与排名、收入统计与排名、类型统计排名（既然支出统计都做了，其他分类统计也顺便做了吧）

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
   - 如分类有值，则收支类型自动变为分类所属到类型，且不能修改；