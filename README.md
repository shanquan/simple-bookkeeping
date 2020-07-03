# simple-bookkeeping

## environment

Node.js：`^v12.16.1`, 请使用v12以上版本，如`yarn`未安装使用`npm`即可。

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

### Notes (To Be Done)
1. 每种类型对应一种分类，类型选择后，分类自动确定并不能修改；
2. 设置接口模拟加载csv文件并转换成json, 注意含空格情况要trim下；
3. 支持新增自定义category，categories根据bill提交时自动添加(必须与bill存在对应关系)，每个用户维护一个document（假如后端数据库用MongoDB）
4. types的数据设置可以优化为数组，通过index进行处理；
5. types的统计需要进行一次Map-Reduce操作；
6. chart backgroundColor后面的颜色可以自动随机生成；
7. bills数据需要添加uuid(多用户数据库还可添加userid), 简单添加了Integer类型的id;