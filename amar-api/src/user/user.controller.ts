import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateUserDTO from './dto/createUserDTO';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import UpdateUserDTO from './dto/updateUserDTO';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.user.fetchUsers.status_200,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.user.fetchUsers.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async createUser(@Body() userData: CreateUserDTO): Promise<EndpointReturn> {
    return this.userService.createUser(userData);
  }

  @Get()
  async fetchUsers(): Promise<EndpointReturn> {
    return this.userService.fetchUsers();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.user.fetchUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.user.fetchUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchUser(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<EndpointReturn> {
    return this.userService.fetchUser(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.user.updateUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.user.updateUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { name, email, password, pictureUrl, roleId }: UpdateUserDTO,
  ): Promise<EndpointReturn> {
    return this.userService.updateUser({
      id,
      name,
      email,
      password,
      pictureUrl,
      roleId,
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.user.deleteUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.user.deleteUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async deleteUser(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<EndpointReturn> {
    return this.userService.deleteUser(id);
  }
}
