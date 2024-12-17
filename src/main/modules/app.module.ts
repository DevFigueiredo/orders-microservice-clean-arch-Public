import {
  BadGatewayException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthUseCase } from '@src/data/use-cases/auth/auth.use-case';
import { JwtTokenAdapter } from '@src/infra/adapters/token-adapter';
import { AxiosHttpClient } from '@src/infra/adapters/axios-http-adapter';
import { AuthController } from '@src/presentation/controllers/auth.controller';
import { PrismaDb } from '../config/prisma/prisma-db.config';
import { BCryptPassword } from '@src/utils/bcrypt-password.utils';
import { OrderRepository } from '@src/infra/db/order/order.repository';
import { OrderProductsRepository } from '@src/infra/db/order/order-products.repository';
import { CreateOrderCase } from '@src/data/use-cases/order/create-order.use-case';
import { OrderController } from '@src/presentation/controllers/order.controller';
import { UserTokenData } from '@src/utils/token-data.utils';
import { RemoteGetProducts } from '@src/infra/integrations/remote-get-products.integration';
import { LoggerMiddleware } from '@src/presentation/middlewares/logger.middleware';

@Module({
  imports: [],
  controllers: [AuthController, OrderController],
  providers: [
    AuthUseCase,
    CreateOrderCase,
    OrderRepository,
    OrderProductsRepository,
    UserTokenData,
    RemoteGetProducts,
    JwtTokenAdapter,
    PrismaDb,
    {
      provide: AxiosHttpClient,
      useFactory: () => {
        const httpClient = new AxiosHttpClient();
        httpClient.addResponseInterceptor(
          (response: any) => {
            return response;
          },
          (error) => {
            console.error(error);
            throw new BadGatewayException('External service http client error');
          },
        );
        return httpClient;
      },
    },
    { provide: BCryptPassword, useValue: new BCryptPassword() },
    {
      provide: JwtTokenAdapter,
      useValue: new JwtTokenAdapter(process.env.PASSWORD_HASH),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Aplica o middleware para todas as rotas
  }
}
