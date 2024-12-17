import { ApiProperty, OmitType } from '@nestjs/swagger';
import { OrderProduct } from '@src/domain/entities/order-product.entity';
import { Order } from '@src/domain/entities/order.entity';

export interface ICreateOrderCase {
  execute(
    data: ICreateOrderCase.CreateOrderInput,
  ): Promise<ICreateOrderCase.CreateOrderOutput>;
}

export namespace ICreateOrderCase {
  export class CreateOrderInput {
    @ApiProperty()
    description: string;
    @ApiProperty({
      type: OmitType(OrderProduct, ['createdAt', 'updatedAt', 'orderId', 'id']),
      isArray: true,
    })
    products: Omit<
      OrderProduct,
      'createdAt' | 'updatedAt' | 'orderId' | 'id'
    >[];
  }
  export class CreateOrderOutput extends Order {
    @ApiProperty({ type: OrderProduct, isArray: true })
    products: OrderProduct[];
  }
}
