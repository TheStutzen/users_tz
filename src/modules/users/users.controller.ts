import { Controller, Post, Body, Patch, Get } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { MessagePattern } from '@nestjs/microservices'

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ description: 'Регистрация пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегестрирован проверьте почту!',
  })
  @ApiResponse({ status: 404, description: 'Неудалось создать пользователя' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @MessagePattern('users:getCountByState')
  async getCountByState(data: boolean) {
    return this.usersService.getCountByState(data)
  }

  @Patch()
  @ApiOperation({ description: 'Обновление пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно обновлен!',
  })
  @ApiResponse({ status: 404, description: 'Неудалось обновить пользователя' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  update(@Body() params: Partial<User>) {
    return this.usersService.update(params)
  }

  @Get()
  @ApiOperation({ description: 'Получение всех пользователей' })
  @ApiResponse({
    status: 201,
    description: 'Получение всех пользователей',
  })
  @ApiResponse({ status: 404, description: 'Неудалось получить пользователей' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getAllUsers() {
    return this.usersService.getAllUsers()
  }
}
