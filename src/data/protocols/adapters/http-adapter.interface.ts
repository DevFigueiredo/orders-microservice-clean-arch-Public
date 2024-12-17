import { AxiosRequestConfig } from 'axios';

export namespace IHttpClient {
  export interface IRequestConfig<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: IRequestConfig;
    request?: any;
  }

  export interface IResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }
  export interface IError {
    message: string;
    code?: number;
    response: IResponse;
  }
}
export interface IHttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
  create(config?: any): IHttpClient; // Adiciona o método create
  addRequestInterceptor(
    onFulfilled: (
      config: IHttpClient.IRequestConfig,
    ) => IHttpClient.IRequestConfig,
    onRejected?: (error: IHttpClient.IError) => any,
  ): void;
  addResponseInterceptor(
    onFulfilled: (response: any) => any,
    onRejected?: (error: IHttpClient.IError) => any,
  ): void;
}
