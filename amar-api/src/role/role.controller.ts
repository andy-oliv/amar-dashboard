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
import { RoleService } from './role.service';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateRoleDTO from './dto/createRoleDTO';
import HTTP_MESSAGES from '../utils/messages/httpMessages';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: HTTP_MESSAGES.EN.role.createRole.status_201,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.role.createRole.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async createRole(@Body() roleInfo: CreateRoleDTO): Promise<EndpointReturn> {
    return this.roleService.createRole(roleInfo);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.role.fetchRoles.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.role.fetchRoles.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchRoles(): Promise<EndpointReturn> {
    return this.roleService.fetchRoles();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.role.fetchRole.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'UUID expected',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.role.fetchRole.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchRole(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<EndpointReturn> {
    return this.roleService.fetchRole(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.role.updateRole.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'UUID expected',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.role.fetchRole.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { title }: CreateRoleDTO,
  ) {
    return this.roleService.updateRole({ id, title });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.role.deleteRole.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'UUID expected',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.role.fetchRole.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async deleteRole(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    return this.roleService.deleteRole(id);
  }
}
