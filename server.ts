import HttpHelper from './utils/httpHelper';
import fs from 'fs';
import AnalysisHelper from './utils/analysisHelper';

HttpHelper.GetData("https://lhj.acequant.cn/aqmanager/v2/api-docs")
    .then(p => {
        const methodObj: any = {};
        const obj = p;
        let setData: string[] = ["import { Router } from 'express';", "import random from 'mockjs';", `const ${obj.basePath.replace("/", "")}Server = Router();`];
        // 开始解析
        // 将所有url解析成为一个list能遍历
        const urlList: string[] = Object.keys(obj.paths);
        urlList.forEach(urlSingle => {
            // 获取支持的所有方法
            const methodList: string[] = Object.keys(obj.paths[urlSingle]);
            methodList.forEach(methodSingle => {
                const singleMehtodObj = obj.paths[urlSingle][methodSingle];
                let params: string[] = [];
                let paramsType: any = [];
                singleMehtodObj['parameters'] && singleMehtodObj['parameters'].map((paramsItem: any, i: number) => {
                    if (paramsItem.in !== "header") {

                        let type = "any";
                        switch (paramsItem["type"]) {
                            case "string":
                                type = "string";
                                break;
                            case "integer":
                                type = "number"
                                break;
                        }
                        let name1 = paramsItem.name.split(".").reverse()[0];
                        params[i] = name1;
                        // 添加注释
                        paramsType.push(`/** ${paramsItem.description}*/'${name1}'${paramsItem.required ? "" : "?"}:${type}`);
                        // paramsType[name1] = `/** 奥斯卡大家好好*/'${name1}':${type}`;
                    }
                })
                const tagsName = singleMehtodObj.tags[0].replace(/-/g, "_");
                if (!methodObj[tagsName]) {
                    methodObj[tagsName] = {};
                }

                setData.push(`${obj.basePath.replace("/", "")}Server.${methodSingle}('${obj.basePath + urlSingle}', (req, res) => { res.send(random.mock(${new AnalysisHelper(obj.definitions, "mock").AnalysisResult(singleMehtodObj.responses["200"].schema).replace(/\"/g, "") || "{}"}))});`)
            })
        });
        setData.push(`export default ${obj.basePath.replace("/", "")}Server;`);
        fs.writeFile("./gen/test1.ts", setData.join('\n'), () => {

        });
    })