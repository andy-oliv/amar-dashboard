import { Module } from '@nestjs/common';
import { RollcallController } from './rollcall.controller';
import { RollcallService } from './rollcall.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RollcallController],
  providers: [RollcallService],
})
export class RollcallModule {}
