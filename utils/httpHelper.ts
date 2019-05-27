import axios from 'axios';

export default class HttpHelper {
    static GetData(url: string): Promise<any> {
        return new Promise((resove, rej) => {
            axios.get(url)
                .then(p => {
                    resove(p.data);
                })
                .catch(() => {
                    rej("出现未知错误");
                })
        })
    }
}