import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices'

@Injectable()
export class RmqService implements OnModuleInit {
  private readonly logger = new Logger('RmqService')
  private client: ClientProxy
  private rmqUrl: string

  constructor() {
    this.rmqUrl = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.rmqUrl],
        queue: 'NestJs_queue',
        queueOptions: {
          durable: true,
        },
      },
    })
  }

  async onModuleInit() {
    await this.connect()
  }

  async connect() {
    this.logger.log(`Connecting to RMQ with URL: ${this.rmqUrl}`)
    try {
      await this.client.connect()
      this.logger.log('Successfully connected to RMQ')
    } catch (error) {
      this.logger.error(`Ошибка при подключении к RMQ: ${error.message}`)
      console.error(error)
    }
  }

  async sendToQueue(queue: string, message: any) {
    return this.client.emit<any>(queue, message)
  }
}
