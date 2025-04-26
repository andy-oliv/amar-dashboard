import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class RollcallService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}
}
