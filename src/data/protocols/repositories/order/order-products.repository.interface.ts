import { OrderProduct } from '@src/domain/entities/order-product.entity';

export interface IOrderProductsRepository {
  create(
    params: IOrderProductsRepository.CreateOrderProductsInput,
  ): Promise<IOrderProductsRepository.CreateOrderProductsOutput>;
}
export namespace IOrderProductsRepository {
  export type CreateOrderProductsInput = {
    orderProducts: Omit<OrderProduct, 'createdAt' | 'updatedAt' | 'id'>[];
    orderId: number;
  };
  export type CreateOrderProductsOutput = OrderProduct[];
}
