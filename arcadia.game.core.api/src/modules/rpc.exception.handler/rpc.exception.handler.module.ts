import { Module } from '@nestjs/common';
import { RpcMainExceptionFilter } from './filters/rpc.main.exception.filter';

@Module({
  providers: [RpcMainExceptionFilter],
  exports: [RpcMainExceptionFilter],
})
export class RpcExceptionHandlerModule {

}
