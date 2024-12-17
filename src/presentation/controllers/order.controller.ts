import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../decorators/auth.decorator';
import { CreateOrderCase } from '@src/data/use-cases/order/create-order.use-case';
import { ICreateOrderCase } from '@src/data/use-cases/order/create-order.use-case.dto';

@Controller()
@ApiTags('Order')
export class OrderController {
  constructor(
    @Inject(CreateOrderCase)
    private readonly createOrderCase: ICreateOrderCase,
  ) {}

  @AuthGuard()
  @ApiResponse({ isArray: true, type: ICreateOrderCase.CreateOrderOutput })
  @Post('/order')
  async create(
    @Body() payload: ICreateOrderCase.CreateOrderInput,
  ): Promise<ICreateOrderCase.CreateOrderOutput> {
    return this.createOrderCase.execute(payload);
  }
}
