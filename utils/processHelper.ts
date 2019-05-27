

export const GetArgv = (list: string[]) => {
    const obj: any = {};
    list.splice(0, 3);
    for (let i = 0; i < list.length; i = i + 2) {
        const element = list[i];
        obj[element] = list[i + 1];
    }
    return obj;
}
