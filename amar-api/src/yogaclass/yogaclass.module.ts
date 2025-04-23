import { Module } from '@nestjs/common';
import { YogaclassController } from './yogaclass.controller';
import { YogaclassService } from './yogaclass.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [YogaclassController],
  providers: [YogaclassService],
})
export class YogaclassModule {}
