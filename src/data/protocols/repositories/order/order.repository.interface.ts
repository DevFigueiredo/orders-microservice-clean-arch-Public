import { OrderProduct } from '@src/domain/entities/order-product.entity';
import { Order } from '@src/domain/entities/order.entity';

export interface IOrderRepository {
  create(
    params: IOrderRepository.CreateOrderInput,
  ): Promise<IOrderRepository.CreateOrderOutput>;
}
export namespace IOrderRepository {
  export type CreateOrderInput = Pick<Order, 'userId' | 'description'>;
  export type CreateOrderOutput = Order;
}
