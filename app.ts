import http from 'http';
import HttpHelper from './utils/httpHelper';
import fs from 'fs';
import AnalysisHelper from './utils/analysisHelper';

function GetData(url: string, requestClass = "./request", outPath = "./", fileName = null) {


    HttpHelper.GetData(url)
        .then(p => {
            const stringList: string[] = [
                `import instance from './${requestClass}';`,
                "import { AxiosPromise, AxiosRequestConfig } from 'axios';",
                "interface SetRequestConfig extends AxiosRequestConfig {",
                "    tips?: boolean",
                "}"
            ]
            let setData = stringList.join("\n");
            const methodObj: any = {};
            const methodFilter: any = {};
            const obj = (p);
            // 开始解析
            // 将所有url解析成为一个list能遍历
            const urlList: string[] = Object.keys(obj.paths);
            setData += new AnalysisHelper(obj).AnaType(obj.definitions);
            urlList.forEach(urlSingle => {
                // 获取支持的所有方法
                const methodList: string[] = Object.keys(obj.paths[urlSingle]);
                methodList.forEach(methodSingle => {
                    if (["get", "post", "put", "delete"].includes(methodSingle)) {
                        const singleMehtodObj = obj.paths[urlSingle][methodSingle];
                        let params: string[] = [];
                        let paramsType: any = [];
                        singleMehtodObj['parameters'] && singleMehtodObj['parameters'].map((paramsItem: any, i: number) => {
                            // if (singleMehtodObj.operationId === "lockActivityProjectUsingPOST") {
                            // }
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
                                let name1 = paramsItem.name;
                                // 添加注释
                                if (!params.includes(name1)) {
                                    paramsType.push(`/** ${paramsItem.description}*/'${name1}'${paramsItem.required ? "" : "?"}:${type}`);
                                }
                                params.push(name1);
                            }
                        })
                        const tagsName = singleMehtodObj.tags[0].replace(/-/g, "_");
                        // if (!methodObj[tagsName]) {
                        //     methodObj[tagsName] = {};
                        // }
                        const Iinterface = `I${singleMehtodObj["operationId"]}Props`;
                        const IinterfaceResult = `I${singleMehtodObj["operationId"]}ResultProps`;
                        // 创建实体
                        const model =
                            `
export interface ${Iinterface} {
${paramsType.join(",\n")}
}
\n
                `

                        setData += model;
                        let resultModelName = "any";
                        if (singleMehtodObj.responses["200"].schema && singleMehtodObj.responses["200"].schema.$ref) {
                            resultModelName = (new AnalysisHelper(obj.definitions).DeCodeName(
                                `I${singleMehtodObj.responses["200"].schema.$ref.replace('#/definitions/', "")}Model`
                            ));
                        }
                        let path = obj.basePath + urlSingle;
                        path = "/" + path.replace(/^\/\/*/g, "");
                        path = path.replace("{", "${params.");

                        methodFilter[`'${path}'`] || (methodFilter[`'${path}'`] = {});
                        if (methodSingle === "get" || methodSingle === "delete") {
                            const methosString = `(params:${Iinterface},config:SetRequestConfig={}):AxiosPromise<${resultModelName}> =>  instance.${methodSingle}(\`${path}\`, {...(config as any), params}) as AxiosPromise<${resultModelName}>`;
                            methodObj[singleMehtodObj["operationId"]] = methosString;
                            methodFilter[`'${path}'`][methodSingle] = `${obj.basePath.replace("/", "")}Apis` + "." + singleMehtodObj["operationId"]
                        }
                        else {
                            const methosString = `(params:${Iinterface},config:SetRequestConfig={}):AxiosPromise<${resultModelName}> =>  instance.${methodSingle}(\`${path}\`, params,config as any) as AxiosPromise<${resultModelName}>`;
                            methodObj[singleMehtodObj["operationId"]] = methosString;
                            methodFilter[`'${path}'`][methodSingle] = `${obj.basePath.replace("/", "")}Apis` + "." + singleMehtodObj["operationId"]
                        }
                    }
                })
            });
            setData += `const ${obj.basePath.replace("/", "")}Apis =${JSON.stringify(methodObj, null, 2).replace(/\"/g, "")};
        export default ${obj.basePath.replace("/", "")}Apis;\r\n`;
            setData += `export const ${obj.basePath.replace("/", "")}ApisFilter=${JSON.stringify(methodFilter, null, 2).replace(/\"/g, "")}`
            let pathName = "";
            pathName = outPath + "/" + (fileName ? fileName + ".ts" : `${obj.basePath.replace("/", "")}Apis.ts`);

            fs.writeFile(pathName, setData, (err) => {
                if (!err) {
                    fs.exists(`${outPath}/${requestClass}.ts`, exit => {
                        if (!exit) {
                            // 如果不存在 自动创建request文件
                            fs.copyFile(__dirname + "/template/request.ts", `${outPath}/${requestClass}.ts`, () => {
                                console.log("已自动生成request类");
                            })
                        }
                    });
                    console.log("seccess");
                }
                else {
                    console.log(err);
                }
            });
        })
}
export default GetData;