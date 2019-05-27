# swagger2apicode.js

> 简介  
  
旨在减少前端模块化api文件的工作量和错误率，自动解析swagger api-docs自动生成ts文件，暂只支持解析后自行tsc转换成js代码。后续会支持直接解析js文件，欢迎各位大佬吐槽。  

## 下载  
```
npm i swagger2apicode -dev
or
yarn add swagger2apicode
```
## 使用方式
在当前项目根目录下执行命令行  
```
node ./node_modules/swagger2apicode/index.js -i url http://localhost:59330/swagger/v1/swagger.json 
```
#### 参数  
|   参数   | 必填 |     默认      |                          注解                          |
|:--------:|:----:|:-------------:|:------------------------------------------------------:|
|   url    | yes  |     null      |              指向解析的swagger.config地址              |
|  outDir  |  no  |      ./       | 解析出来的ts文件放置的路径，以当前目录为参照的相对路径 |
|    rc    |  no  |    request    |        解析出来的请求模块文件名，路径跟随outdir        |
| fileName |  no  | swagger的名称 |                 解析的具体文件的文件名                 |

#### 完整使用
```
node ./node_modules/swagger2apicode/index.js -i url http://localhost:59330/swagger/v1/swagger.json outDir ./src/request
```

