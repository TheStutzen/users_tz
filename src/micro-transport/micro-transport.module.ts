import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MicroTransportService } from './micro-transport.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MICROSERVICE_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'data-access-layer',
          port: 3090,
        },
      },
    ]),
  ],
  providers: [MicroTransportService],
  exports: [MicroTransportService],
})
export class MicroTransportModule {}
