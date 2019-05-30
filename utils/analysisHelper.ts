export default class AnalysisHelper {
    ApiObj: any;
    GenType: "d.ts" | "mock" = "d.ts";
    constructor(_apiobj: any, _genType?: "d.ts" | "mock") {
        this.ApiObj = _apiobj;
        if (_genType) {
            this.GenType = _genType;
        }
    }

    AnaType(data: any) {
        const modelList: string[] = Object.keys(data);
        const list: string[] = [];
        return modelList.map((p, index) => {
            // this.AnalysisResult(data[p]);


            const name = `export interface I${this.DeCodeName(p)}Model`;
            if (!list.find(p => p === name)) {
                list.push(name);
                return (
                    `
    ${name} ${JSON.stringify(this.AnalysisObject(data[p]), null, 4)}
    `
                )
            }
            else {
                return "";
            }

        }).join('\n').replace(/\"/g, "");

    }

    /**
     * 替换名称
     * @param name 
     */
    DeCodeName(name: string) {
        return name.replace(/\[|\]|\{|\}|\«|\»|\./g, "");
    }


    AnalysisResult(path: any) {
        if (path.$ref) {
            // const data = this.ApiObj[path.$ref.replace("#/definitions/", "")];
            // const result = this.AnalysisObject(this.ApiObj[path.$ref.replace("#/definitions/", "")]);
            // return result ? JSON.stringify(result, null, 4) : JSON.stringify({})
            return "";
        }
        else {
            return "";
        }
    }

    AnalysisSingle(obj: any): string {
        let result: any = {};
        switch (obj && obj.type) {
            case "object":
                return this.AnalysisObject(obj);
            case "array":
                if (obj.items.$ref) {
                    let pathList = obj.items.$ref.split("/");
                    pathList.reverse();
                    return "I" + pathList[0] + "Model[]"
                }
                else {
                    return `${this.AnalysisSingle(obj.items)}[]`;
                }
                break;
            case "integer":
                return this.DecodeType(obj, 'number')!; //this.GenType === "d.ts" ? 'number' : ""
            case "number":
                return this.DecodeType(obj, 'number')!;
            case "string":
                return this.DecodeType(obj, 'string')!; // this.GenType === "d.ts" ? 'string' : "";
            case "boolean":
                return this.DecodeType(obj, 'boolean')!; // this.GenType === "d.ts" ? 'boolean' : "";
        }
        if (obj && obj.$ref) {
            const data = this.ApiObj[obj.$ref.replace("#/definitions/", "")];
            result = this.AnalysisSingle(data);
        }
        return "any";
    }

    DecodeType(obj: any, type: string) {
        if (this.GenType === "d.ts") {
            return type;
        }
        else {
            if (obj.example) {
                if ((obj.example as string).startsWith("@")) {
                    // 需要使用mock
                    const strList = (obj.example as string).split("|");
                    if (strList.length > 1) {
                        // 有限制
                        const numList = strList[1].split("-");
                        if (numList.length > 1) {
                            // 有两个限制
                            return `random.Random[${obj.example.replace("@", "")}](${numList[0]},${numList[1]})`;
                        }
                        else {
                            return `random.Random[${obj.example.replace("@", "")}](${strList[1]})`;
                        }
                    }
                    else {
                        return `'${obj.example}'`;
                    }
                }
                else {
                    return `'${obj.example}'`;
                }
            }
            else {
                // 默认使用mock
                switch (obj.type) {
                    case "integer":
                        if (["int32", "int64"].includes(obj.format)) {
                            return "'@integer'";
                        } else {
                            return "'@float'";
                        } //this.GenType === "d.ts" ? 'number' : ""
                    case "number":
                        return "'@float'";
                    case "string":
                        return "'@title'";
                    case "boolean":
                        return "'@boolean'";
                }
            }
        }
    }


    AnalysisObject(obj: any) {
        const result: any = {};
        const newObj = obj.properties
        if (newObj) {
            Object.keys(newObj).forEach((p: any) => {
                if (newObj[p]["$ref"]) {
                    const pathList = newObj[p]["$ref"].split("/");
                    pathList.reverse();
                    result[`/** ${newObj[p].description}*/'${p}'`] = `I${this.DeCodeName(pathList[0])}Model` // this.AnalysisSingle(newObj[p]);
                }
                else {
                    result[`/** ${newObj[p].description}*/'${p}'`] = this.AnalysisSingle(newObj[p]);
                }
            })
        }
        return result;
    }
};