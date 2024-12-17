import { Inject, Injectable } from '@nestjs/common';

import { IRemoteGetProducts } from '../../data/protocols/integrations/remote-get-products.integration.interface';
import { AxiosHttpClient } from '../adapters/axios-http-adapter';
import { IHttpClient } from '@src/data/protocols/adapters/http-adapter.interface';
import { UserTokenData } from '@src/utils/token-data.utils';

@Injectable()
export class RemoteGetProducts implements IRemoteGetProducts {
  constructor(
    @Inject(AxiosHttpClient)
    private readonly httpClient: IHttpClient,
    private readonly userTokenData: UserTokenData,
  ) {}
  async execute(): Promise<IRemoteGetProducts.RemoteGetProductsOutput[]> {
    const products = await this.httpClient.get<
      IRemoteGetProducts.RemoteGetProductsOutput[]
    >(`${process.env.MICROSERVICE_PRODUCTS_URL}/products`, {
      headers: {
        Authorization: `Bearer ${this.userTokenData.getToken()}`,
      },
    });
    return products;
  }
}
