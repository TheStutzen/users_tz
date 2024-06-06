import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { RedisModule } from '@nestjs-modules/ioredis'
import { RmqModule } from './rmq/rmq.module'

@Module({
  imports: [UsersModule, RedisModule, RmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
