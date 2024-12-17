import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '@src/data/protocols/repositories/order/order.repository.interface';
import { IOrderProductsRepository } from '@src/data/protocols/repositories/order/order-products.repository.interface';
import { ICreateOrderCase } from './create-order.use-case.dto';
import { UserTokenData } from '@src/utils/token-data.utils';
import { IRemoteGetProducts } from '@src/data/protocols/integrations/remote-get-products.integration.interface';
import { RemoteGetProducts } from '@src/infra/integrations/remote-get-products.integration';
import { OrderRepository } from '@src/infra/db/order/order.repository';
import { OrderProductsRepository } from '@src/infra/db/order/order-products.repository';

@Injectable()
export class CreateOrderCase implements ICreateOrderCase {
  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: IOrderRepository,
    @Inject(OrderProductsRepository)
    private readonly orderProductsRepository: IOrderProductsRepository,
    @Inject(UserTokenData)
    private readonly userTokenData: UserTokenData,
    @Inject(RemoteGetProducts)
    private readonly remoteGetProducts: IRemoteGetProducts,
  ) {}

  async execute(
    data: ICreateOrderCase.CreateOrderInput,
  ): Promise<ICreateOrderCase.CreateOrderOutput> {
    const userId = this.userTokenData.get().id;
    const productsFinded = await this.remoteGetProducts.execute();

    const missingProducts = this.findMissingProducts(
      data.products,
      productsFinded,
    );
    if (missingProducts.length > 0) {
      throw new HttpException(
        {
          message: 'The following products were not found',
          missingProducts,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const order = await this.createOrder(data.description, userId);

    const products = await this.createOrderProducts(order.id, data.products);
    return { ...order, products };
  }

  private async createOrder(description: string, userId: number) {
    return this.orderRepository.create({
      description,
      userId,
    });
  }

  private findMissingProducts(products: any[], productsFinded: any[]) {
    return products.filter(
      (product) =>
        !productsFinded.some((item) => item.id === product.productId),
    );
  }

  private async createOrderProducts(
    orderId: number,
    products: ICreateOrderCase.CreateOrderInput['products'],
  ) {
    return this.orderProductsRepository.create({
      orderId,
      orderProducts: products.map(
        ({ name, description, price, quantity, totalPrice, productId }) => ({
          name,
          description,
          orderId,
          price,
          quantity,
          totalPrice,
          productId,
        }),
      ),
    });
  }
}
