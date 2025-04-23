import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChildService } from './child.service';
import { ApiTags } from '@nestjs/swagger';
import EndpointReturn from '../interfaces/EndpointReturn';
import CreateChildDTO from './dto/createChildDTO';

@ApiTags('Children')
@Controller('children')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post()
  async createChild(
    @Body() childInfo: CreateChildDTO,
  ): Promise<EndpointReturn> {
    return this.childService.createChild(childInfo);
  }

  @Get()
  async fetchChildren(): Promise<EndpointReturn> {
    return this.childService.fetchChildren();
  }
}
