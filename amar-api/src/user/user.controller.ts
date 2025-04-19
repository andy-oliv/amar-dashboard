import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { UserService } from './user.service';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateUserDTO from './dto/createUserDTO';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createUser(@Body() userData: CreateUserDTO): Promise<EndpointReturn> {
    return;
  }
}
