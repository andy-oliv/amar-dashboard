import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import YogaClass from '../interfaces/YogaClass';
import EndpointReturn from '../interfaces/EndpointReturn';

@Injectable()
export class YogaclassService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createClass(classinfo: YogaClass): Promise<EndpointReturn> {
    try {
      return;
    } catch (error) {}
  }
}
