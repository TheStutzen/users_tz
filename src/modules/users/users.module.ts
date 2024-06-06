import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MicroTransportModule } from 'src/micro-transport/micro-transport.module'
import { RmqModule } from 'src/rmq/rmq.module'

@Module({
  imports: [MicroTransportModule, RmqModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
