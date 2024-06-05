import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string

  @ApiProperty()
  @IsOptional()
  lastName: string

  @ApiProperty()
  @IsNotEmpty()
  age: number

  @ApiProperty()
  @IsOptional()
  gender: string

  @ApiProperty({
    type: String,
    example: 'email@email.main',
    required: true,
    nullable: false,
  })
  @IsEmail()
  email: string
}
