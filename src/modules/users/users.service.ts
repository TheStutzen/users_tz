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
dayjs.extend(utc)

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly microTransportService: MicroTransportService,
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

    await this.microTransportService.sendToMicroservice('signUp_sendEmail', {
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      password,
    })

    await this.microTransportService.sendToMicroservice('createUser', {
      userId: user.id,
      createdAt: dayjs().utc().format(),
      method: 'created',
    })

    return 'Пользователь успешно зарегестрирован проверьте почту!'
  }

  async findByEmail(params: string): Promise<User> {
    const result = await this.userRepository
      .createQueryBuilder('User')
      .where('User.email = :email', { email: params })
      .getOne()

    return result
  }

  async getCountByState(params: boolean) {
    const result = await this.userRepository
      .createQueryBuilder('User')
      .where('User.state = :state', { state: params })
      .getCount()

    return result
  }

  async update(params: Partial<User>) {
    const { id, ...data } = params

    await this.userRepository.update(id, data)

    await this.microTransportService.sendToMicroservice('createUser', {
      userId: id,
      updatedAt: dayjs().utc().format(),
      method: 'updated',
    })

    return 'Пользователь успешно обновлен!'
  }

  async getAllUsers() {
    return await this.userRepository.createQueryBuilder('User').getMany()
  }
}
