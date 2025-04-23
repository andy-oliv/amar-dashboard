import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import CreateClientDTO from './dto/CreateClientDTO';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import Client from '../interfaces/Client';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import EndpointReturn from '../interfaces/EndpointReturn';
import updateClientDTO from './dto/updateClientDTO';

@ApiTags('Client')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: HTTP_MESSAGES.EN.client.createClient.status_201,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.client.createClient.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async createClient(
    @Body() clientInfo: CreateClientDTO,
  ): Promise<{ message: string; data: Client }> {
    return this.clientService.createClient(clientInfo);
  }

  @Get()
  async fetchClientByName(
    @Query('clientName') clientName: string,
  ): Promise<EndpointReturn> {
    return this.clientService.fetchClientByName(clientName);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.client.fetchClients.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.client.fetchClients.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchClients(): Promise<{ message: string; data: Client[] }> {
    return this.clientService.fetchClients();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.client.fetchClient.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.client.fetchClient.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchClient(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string; data: Client }> {
    return this.clientService.fetchClient(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.client.updateClient.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.client.updateClient.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async updateClient(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body()
    updatedData: updateClientDTO,
  ): Promise<EndpointReturn> {
    return this.clientService.updateClient({ id, ...updatedData });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.client.deleteClient.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.client.deleteClient.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async deleteClient(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<EndpointReturn> {
    return this.clientService.deleteClient(id);
  }
}
