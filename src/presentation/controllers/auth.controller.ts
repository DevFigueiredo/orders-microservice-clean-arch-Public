import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IAuthUseCase } from '@src/data/use-cases/auth/auth.use-case.dto';
import { AuthUseCase } from 'src/data/use-cases/auth/auth.use-case';

@Controller()
@ApiTags('Authentication')
export class AuthController {
  constructor(
    @Inject(AuthUseCase)
    private readonly authUseCase: IAuthUseCase,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() payload: IAuthUseCase.Input,
  ): Promise<IAuthUseCase.Output> {
    return this.authUseCase.execute(payload);
  }
}
