import {
  BadRequestException,
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
import { LocationService } from './location.service';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateLocationDTO from './dto/createLocationDTO';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import generateTimestamp from '../helpers/generateTimestamp';
import FetchLocationDTO from './dto/fetchLocationDTO';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import UpdateLocationDTO from './dto/updateLocationDTO';

@ApiTags('Locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: HTTP_MESSAGES.EN.location.createLocation.status_201,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.location.createLocation.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async createLocation(
    @Body() locationInfo: CreateLocationDTO,
  ): Promise<EndpointReturn> {
    return this.locationService.createLocation(locationInfo);
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.location.fetchLocations.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.location.fetchLocations.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchLocations(): Promise<EndpointReturn> {
    return this.locationService.fetchLocations();
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.location.fetchLocationsByNameOrAddress.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.location.fetchLocationsByNameOrAddress.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchLocationsByNameOrAddress(
    @Query() { name, address }: FetchLocationDTO,
  ): Promise<EndpointReturn> {
    if (!name && !address) {
      throw new BadRequestException({
        message: '',
        pid: process.pid,
        timestamp: generateTimestamp(),
      });
    }

    return this.locationService.fetchLocationsByNameOrAddress({
      name,
      address,
    });
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.location.fetchLocation.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.location.fetchLocation.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchLocation(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<EndpointReturn> {
    return this.locationService.fetchLocation(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.location.updateLocation.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.location.updateLocation.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async updateLocation(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedData: UpdateLocationDTO,
  ): Promise<EndpointReturn> {
    return this.locationService.updateLocation({ id, ...updatedData });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.location.deleteLocation.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.location.deleteLocation.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async deleteLocation(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<EndpointReturn> {
    return this.locationService.deleteLocation(id);
  }
}
