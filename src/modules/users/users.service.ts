import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { MicroTransportService } from 'src/micro-transport/micro-transport.service'
import { generatePassword } from 'src/utils/GenPass'
import { hashPassword } from 'src/utils/Bcrypt'
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import { RmqService } from 'src/rmq/rmq.service'
dayjs.extend(utc)

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly microTransportService: MicroTransportService,
    private readonly rmqService: RmqService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailCheck = await this.findByEmail(createUserDto.email)

    if (emailCheck) {
      throw new BadRequestException(
        'Пользователь с указанной почтой уже существует!',
      )
    }

    const password = generatePassword()

    const user = await this.userRepository.save({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      age: createUserDto.age,
      gender: createUserDto.gender,
      password: await hashPassword(password),
    })

    await this.rmqService.sendToQueue('signUp_sendEmail', {
      type: 'email',
      data: {
        priority: 'high',
        template: 'signup',
        templateData: {
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          password,
        },
      },
    })

    await this.microTransportService.sendToMicroservice('users:createUser', {
      user,
    })

    return 'Пользователь успешно зарегестрирован проверьте почту!'
  }

  async findByEmail(params: string): Promise<User> {
    const result = await this.microTransportService.sendToMicroservice(
      'users:findByEmail',
      { params },
    )

    return result
  }

  async getCountByState(params: boolean) {
    const result = await this.microTransportService.sendToMicroservice(
      'users:getCountByState',
      { params },
    )

    return result
  }

  async update(params: Partial<User>) {
    const result = await this.microTransportService.sendToMicroservice(
      'users:update',
      {
        params,
      },
    )

    if (result) {
      return 'Пользователь успешно обновлен!'
    }
    return 'Что-то пошло не так!'
  }

  async getAllUsers() {
    return await this.userRepository.createQueryBuilder('User').getMany()
  }
}
