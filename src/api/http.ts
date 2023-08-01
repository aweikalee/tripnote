/*
 * 对axios进行二次封装，引用http就好
 * 基本用法同axios
 */

import Axios, {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    AxiosPromise,
    AxiosInstance
} from 'axios'
import { getErrorMessage } from './errorMessage'
import errorHandler from './errorHandler'
import Loading from 'element-ui/lib/loading'

export interface IHttpConfig extends AxiosRequestConfig {
    loading?: boolean
}
export interface IResponse<T> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request?: any
}
export interface IErrorResponse extends Error {
    config: AxiosRequestConfig
    code?: number
    request?: any
    response?: AxiosResponse
}

export interface IHttpPromise<T> extends Promise<T> {}

export interface IHttpBaseConfig {
    MIN_TIME: number
}

const defaultHttpConfig: IHttpBaseConfig = {
    MIN_TIME: 0 // 加载提示启动时间，设为100则为发起请求后100ms内没有收到请求则启动加载提示。
}

export class HttpRequest {
    instance!: AxiosInstance
    private MIN_TIME!: number

    constructor(
        axiosConfig?: AxiosRequestConfig,
        otherConfig?: IHttpBaseConfig
    ) {
        if (!(this instanceof HttpRequest)) {
            return new HttpRequest(axiosConfig, otherConfig)
        }
        Object.assign(this, defaultHttpConfig, otherConfig || {})
        this.instance = Axios.create(axiosConfig || {})
    }
    request<T>(config: IHttpConfig): Promise<T> {
        let instance: <S>(config: IHttpConfig) => AxiosPromise<S>
        if (config.loading) {
            instance = this.loading
            config = Object.assign({}, config)
            delete config.loading
        } else {
            instance = this.instance.request
        }
        instance = instance.bind(this)

        return new Promise<T>((resolve, reject) => {
            instance<T>(config)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    /* 错误处理 */
                    const data = error.response ? error.response.data : {}
                    const status = error.response ? error.response.status : 0
                    /* 对一些错误进行处理 */
                    if (status in errorHandler) {
                        errorHandler[status]()
                    }

                    let message = ''
                    if (data && data.message) {
                        message = data.message || getErrorMessage(data.code)
                    }
                    if (!message) {
                        message =
                            error.message ||
                            getErrorMessage(status) ||
                            `错误代码： ${status}`
                    }
                    let result: IErrorResponse
                    result = Object.assign(new Error(message), {
                        config: error.config,
                        request: error.request,
                        response: error.response,
                        status
                    })
                    return reject(result)
                })
        })
    }
    get<T>(url: string, config?: IHttpConfig) {
        return this.request<T>(
            Object.assign(config || {}, {
                method: 'get',
                url
            })
        )
    }
    delete<T>(url: string, config?: IHttpConfig) {
        return this.request<T>(
            Object.assign(config || {}, {
                method: 'delete',
                url
            })
        )
    }
    head<T>(url: string, config?: IHttpConfig) {
        return this.request<T>(
            Object.assign(config || {}, {
                method: 'head',
                url
            })
        )
    }
    options<T>(url: string, config?: IHttpConfig) {
        return this.request<T>(
            Object.assign(config || {}, {
                method: 'options',
                url
            })
        )
    }
    post<T>(url: string, data?: any, config?: IHttpConfig) {
        return this.request<T>(
            Object.assign(config || {}, {
                method: 'post',
                url,
                data
            })
        )
    }
    put<T>(url: string, data?: any, config?: IHttpConfig) {
        return this.request<T>(
            Object.assign(config || {}, {
                method: 'put',
                url,
                data
            })
        )
    }
    patch<T>(url: string, data?: any, config?: IHttpConfig) {
        return this.request<T>(
            Object.assign(config || {}, {
                method: 'patch',
                url,
                data
            })
        )
    }
    /**
     * 发起请求时，显示加载中
     */
    private loading<T>(config: IHttpConfig): AxiosPromise<T> {
        let loading: any
        const timer: number = setTimeout(() => {
            loading = Loading.service({
                lock: true,
                text: 'Loading...'
            })
        }, this.MIN_TIME)

        function clear() {
            clearTimeout(timer)
            if (loading) {
                loading.close()
            }
        }

        return new Promise((resolve, reject) => {
            this.instance
                .request(config)
                .then((response) => {
                    clear()
                    resolve(response)
                })
                .catch((error: any) => {
                    clear()
                    reject(error)
                })
        })
    }
}
