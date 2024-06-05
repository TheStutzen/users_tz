import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { MicroTransportModule } from 'src/micro-transport/micro-transport.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), MicroTransportModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
