import { Body, Controller } from '@nestjs/common';
import { YogaclassService } from './yogaclass.service';
import EndpointReturn from '../interfaces/EndpointReturn';
import createClassDTO from './dto/createClassDTO';

@Controller('yogaclass')
export class YogaclassController {
  constructor(private readonly yogaclassService: YogaclassService) {}

  async createClass(
    @Body() classInfo: createClassDTO,
  ): Promise<EndpointReturn> {
    return this.yogaclassService.createClass(classInfo);
  }
}
