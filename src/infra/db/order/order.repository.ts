import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@src/data/protocols/repositories/order/order.repository.interface';
import { PrismaDb } from 'src/main/config/prisma/prisma-db.config';
@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaDb) {}
  async create(
    params: IOrderRepository.CreateOrderInput,
  ): Promise<IOrderRepository.CreateOrderOutput> {
    const order = await this.prisma.order.create({
      data: {
        userId: params.userId,
        description: params.description,
      },
    });

    return order;
  }
}
