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
          host: 'mailer',
          port: 3050,
        },
      },
    ]),
  ],
  providers: [MicroTransportService],
  exports: [MicroTransportService],
})
export class MicroTransportModule {}
