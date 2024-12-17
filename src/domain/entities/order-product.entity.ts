import { ApiProperty } from '@nestjs/swagger';

export class OrderProduct {
  @ApiProperty()
  id: number;
  @ApiProperty()
  productId: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  totalPrice: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  orderId: number;
}
