import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailCheck = await this.userRepository
      .createQueryBuilder('User')
      .where('User.email = :email', { email: createUserDto.email })
      .getOne()

    if (emailCheck)
      throw new BadRequestException(
        'Пользователь с указанной почтой уже существует!',
      )

    const user = await this.userRepository.save({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      age: createUserDto.age,
      gender: createUserDto.gender,
    })

    this.microTransportService
  }

  async findByEmail() {
    const result = await this.userRepository
      .createQueryBuilder('User')
      .where('User.email = :email', { email: createUserDto.email })
      .getOne()

    return result
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
