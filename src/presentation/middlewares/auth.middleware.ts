import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { AxiosHttpClient } from '@src/infra/adapters/axios-http-adapter';
import { IHttpClient } from '@src/data/protocols/adapters/http-adapter.interface';

@Injectable()
export class AuthMiddleware implements CanActivate {
  constructor(
    @Inject(AxiosHttpClient) private readonly httpClient: IHttpClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    try {
      await this.httpClient.post(
        `${process.env.MICROSERVICE_AUTH_URL}/check-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return true;
    } catch (error) {
      throw new HttpException(
        'Token validation failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
