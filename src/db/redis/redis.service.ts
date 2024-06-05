import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisCacheService {
  private readonly redisClient: Redis

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis(this.configService.get('REDIS_URL'))
  }

  /**
   * set params
   * @param key
   * @param item
   * @param ttl - time to live in sec
   */
  async set<TData>(
    key: string,
    item: TData,
    ttl?: number,
  ): Promise<{ key: string }> {
    ttl ??= this.configService.get<number>('STORAGE_REDIS_DEFAULT_TTL')

    await this.redisClient.setex(key, ttl, JSON.stringify(item))

    return { key }
  }

  async get<TData>(key: string): Promise<TData | null> {
    const json = await this.redisClient.get(key)

    if (!json) {
      return null
    }

    return JSON.parse(json) as TData
  }

  /**
   * Delete item from cache
   * @param key
   */
  async delete(key: string): Promise<void> {
    await this.redisClient.del(key)
  }

  closeConnection(): void {
    this.redisClient.disconnect()
  }
}
