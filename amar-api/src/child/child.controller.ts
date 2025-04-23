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
import { ChildService } from './child.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateChildDTO from './dto/createChildDTO';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import UpdateChildDTO from './dto/updateChildDTO';

@ApiTags('Children')
@Controller('children')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: HTTP_MESSAGES.EN.child.createChild.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: HTTP_MESSAGES.EN.client.helpers.status_400,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: HTTP_MESSAGES.EN.child.createChild.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async createChild(
    @Body() childInfo: CreateChildDTO,
  ): Promise<EndpointReturn> {
    return this.childService.createChild(childInfo);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.child.fetchChildrenByName.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.child.fetchChildrenByName.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  fetchChildrenByName(@Query('name') name: string): Promise<EndpointReturn> {
    return this.childService.fetchChildrenByName(name);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.child.fetchChildren.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.child.fetchChildren.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchChildren(): Promise<EndpointReturn> {
    return this.childService.fetchChildren();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.child.fetchChild.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.child.fetchChild.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async fetchChild(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<EndpointReturn> {
    return this.childService.fetchChild(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.child.updateChild.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.child.updateChild.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async updateChild(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { name }: UpdateChildDTO,
  ) {
    return this.childService.updateChild({ id, name });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: HTTP_MESSAGES.EN.child.deleteChild.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: HTTP_MESSAGES.EN.child.deleteChild.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal error',
    example: HTTP_MESSAGES.EN.generalMessages.status_500,
  })
  async deleteChild(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.childService.deleteChild(id);
  }
}
