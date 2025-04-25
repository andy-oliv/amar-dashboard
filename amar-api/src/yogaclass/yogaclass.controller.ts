import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { YogaclassService } from './yogaclass.service';
import EndpointReturn from '../interfaces/EndpointReturn';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateClassDTO from './dto/createClassDTO';
import FetchClassesDTO from './dto/fetchClassesDTO';
import FetchByRangeDTO from './dto/fetchByRangeDTO';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import UpdateClassDTO from './dto/updateClassDTO';
import { Logger } from 'nestjs-pino';

@ApiTags('Yoga Classes')
@Controller('yogaclasses')
export class YogaclassController {
  constructor(
    private readonly yogaclassService: YogaclassService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: HTTP_MESSAGES.EN.yogaClass.createClass.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: HTTP_MESSAGES.EN.yogaClass.createClass.status_400,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.yogaClass.createClass.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async createClass(
    @Body() classInfo: CreateClassDTO,
  ): Promise<EndpointReturn> {
    return this.yogaclassService.createClass(classInfo);
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.yogaClass.fetchClasses.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.yogaClass.fetchClasses.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchClasses(): Promise<EndpointReturn> {
    return this.yogaclassService.fetchClasses();
  }

  @Get('date')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.yogaClass.fetchByRange.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.yogaClass.fetchByRange.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchByRange(@Query() query: FetchByRangeDTO): Promise<EndpointReturn> {
    return this.yogaclassService.fetchByRange(query);
  }

  @Get('queries')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.yogaClass.fetchByQuery.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.yogaClass.fetchByQuery.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchByQuery(
    @Query()
    query: FetchClassesDTO,
  ): Promise<EndpointReturn> {
    return this.yogaclassService.fetchByQuery(query);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.yogaClass.fetchClass.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.yogaClass.fetchClass.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchClass(
    @Param('id', new ParseIntPipe()) classId: number,
  ): Promise<EndpointReturn> {
    return await this.yogaclassService.fetchClass(classId);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.yogaClass.updateClass.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: HTTP_MESSAGES.EN.yogaClass.updateClass.status_400,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.yogaClass.updateClass.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async updateClass(
    @Param('id', new ParseIntPipe()) id: number,
    @Body()
    { type, status, date, time, instructorId, locationId }: UpdateClassDTO,
  ): Promise<EndpointReturn> {
    return await this.yogaclassService.updateClass(id, {
      type,
      status,
      date,
      time,
      instructorId,
      locationId,
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.yogaClass.deleteClass.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.yogaClass.deleteClass.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async deleteClass(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<EndpointReturn> {
    return this.yogaclassService.deleteClass(id);
  }
}
