import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RollcallService } from './rollcall.service';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateRollCallDTO from './dto/createRollCallDTO';
import HTTP_MESSAGES from '../utils/messages/httpMessages';

@ApiTags('Roll Calls')
@Controller('rollcalls')
export class RollcallController {
  constructor(private readonly rollcallService: RollcallService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: HTTP_MESSAGES.EN.rollCall.createRollCall.status_201,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.helpers.checkRollCallExists.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async createRollCall(
    @Body() data: CreateRollCallDTO,
  ): Promise<EndpointReturn> {
    return this.rollcallService.createRollCall(data);
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.rollCall.fetchRollCalls.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.rollCall.fetchRollCalls.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchRollCalls(): Promise<EndpointReturn> {
    return this.rollcallService.fetchRollCalls();
  }
}
