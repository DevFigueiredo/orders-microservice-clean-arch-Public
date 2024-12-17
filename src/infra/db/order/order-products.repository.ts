import { Injectable } from '@nestjs/common';
import { IOrderProductsRepository } from '@src/data/protocols/repositories/order/order-products.repository.interface';
import { PrismaDb } from 'src/main/config/prisma/prisma-db.config';
@Injectable()
export class OrderProductsRepository implements IOrderProductsRepository {
  constructor(private readonly prisma: PrismaDb) {}
  async create(
    params: IOrderProductsRepository.CreateOrderProductsInput,
  ): Promise<IOrderProductsRepository.CreateOrderProductsOutput> {
    const data = params.orderProducts.map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      productId: item.productId,
      orderId: item.orderId,
    }));
    await this.prisma.orderProduct.createMany({
      data,
    });

    const orderProducts = await this.prisma.orderProduct.findMany({
      where: {
        orderId: params.orderId,
      },
    });

    return orderProducts;
  }
}
