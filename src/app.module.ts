import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { MicroTransportModule } from './micro-transport/micro-transport.module'

@Module({
  imports: [UsersModule, MicroTransportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
