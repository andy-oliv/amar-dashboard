import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ClientService } from './client.service';
import CreateClientDTO from './dto/CreateClientDTO';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import Client from '../interfaces/Client';
import HTTP_MESSAGES from '../utils/messages/httpMessages';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(
    private readonly logger: Logger,
    private readonly clientService: ClientService,
  ) {}

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
    this.logger.log('creating new client...');

    return this.clientService.createClient(clientInfo);
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
  async fetchClient(
    @Param('id', new ParseUUIDPipe()) { id }: Partial<Client>,
  ): Promise<{ message: string; data: Client }> {
    return this.clientService.fetchClient(id);
  }
}
