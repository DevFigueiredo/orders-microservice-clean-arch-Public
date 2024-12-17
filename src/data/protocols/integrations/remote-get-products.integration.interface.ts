import { ApiProperty, OmitType } from '@nestjs/swagger';

export interface IRemoteGetProducts {
  execute(): Promise<IRemoteGetProducts.RemoteGetProductsOutput[]>;
}

export namespace IRemoteGetProducts {
  export class RemoteGetProductsOutput {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    price: number;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
  }
}
