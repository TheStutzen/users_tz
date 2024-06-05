import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class MicroTransportService {
  constructor(@Inject('MICROSERVICE_CLIENT') private client: ClientProxy) {}

  public async sendToMicroservice(pattern: string, data: any): Promise<any> {
    const observable = this.client.send(pattern, data)
    return await lastValueFrom(observable)
  }
}
