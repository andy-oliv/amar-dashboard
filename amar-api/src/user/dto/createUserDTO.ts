import { IsIn, IsOptional, IsString } from 'class-validator';

export default class CreateUserDTO {
  name: string;
  email: string;
  password: string;

  @IsOptional({ message: '' })
  @IsString({ message: '' })
  pictureUrl: string;

  roleId: string;
}
