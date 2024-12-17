import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { IHttpClient } from '@src/data/protocols/adapters/http-adapter.interface';

export class AxiosHttpClient implements IHttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config);
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }
  async patch<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url);
    return response.data;
  }

  // Método para criar uma nova instância do Axios com configuração customizada
  create(config?: AxiosRequestConfig): IHttpClient {
    return new AxiosHttpClient(config);
  }

  // Método para adicionar interceptors de request
  addRequestInterceptor(
    onFulfilled: (
      config: IHttpClient.IRequestConfig,
    ) => IHttpClient.IRequestConfig,
    onRejected?: (error: IHttpClient.IError) => any,
  ): void {
    this.axiosInstance.interceptors.request.use(onFulfilled as any, onRejected);
  }

  // Método para adicionar interceptors de response
  addResponseInterceptor(
    onFulfilled: (response: IHttpClient.IRequestConfig) => AxiosResponse,
    onRejected?: (error: any) => any,
  ): void {
    this.axiosInstance.interceptors.response.use(
      onFulfilled as any,
      onRejected,
    );
  }
}
