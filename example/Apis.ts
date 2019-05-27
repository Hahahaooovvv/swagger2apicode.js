import instance from './request';
import { AxiosPromise, AxiosRequestConfig } from 'axios';
interface SetRequestConfig extends AxiosRequestConfig {
  tips?: boolean
}
interface IResultUserLoginResultModel {
    /** undefined*/'code': number,
    /** undefined*/'message': string,
    /** undefined*/'data': IUserLoginResultModel
}


interface IUserLoginResultModel {
    /** 会员逻辑ID*/'memberId': string,
    /** 登录TOKEN*/'accessToken': string,
    /** 昵称*/'nickName': string,
    /** 头像地址*/'avatar': string
}


interface IResultStringModel {
    /** undefined*/'code': number,
    /** undefined*/'message': string,
    /** undefined*/'data': string[]
}

interface IApiUserLoginPostProps {
/** 账号*/'userId'?: string,
/** 密码*/'userPwd'?: string
}



interface IApiUserLoginTestPostProps {
/** undefined*/'userId'?: string,
/** undefined*/'userPwd'?: string
}



interface IApiUserLoginTest333PostProps {
/** undefined*/'userId'?: string,
/** undefined*/'userPwd'?: string
}


const Apis = {
  ApiUserLoginPost: (params: IApiUserLoginPostProps, config: SetRequestConfig = {}): AxiosPromise<IResultUserLoginResultModel> => instance.post('api/user/login', params, config as any) as AxiosPromise<IResultUserLoginResultModel>,
  ApiUserLoginTestPost: (params: IApiUserLoginTestPostProps, config: SetRequestConfig = {}): AxiosPromise<IResultStringModel> => instance.post('api/user/login/test', params, config as any) as AxiosPromise<IResultStringModel>,
  ApiUserLoginTest333Post: (params: IApiUserLoginTest333PostProps, config: SetRequestConfig = {}): AxiosPromise<IResultStringModel> => instance.post('api/user/login/test333', params, config as any) as AxiosPromise<IResultStringModel>
};
export default Apis