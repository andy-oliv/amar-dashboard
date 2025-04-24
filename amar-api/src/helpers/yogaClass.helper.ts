import YogaClass from '../interfaces/YogaClass';
import { PrismaService } from '../prisma/prisma.service';

export async function checkClassExists(
  prismaService: PrismaService,
  classInfo: YogaClass,
) {
  const newClass: YogaClass = await prismaService.yogaClass.findFirst({
    where: {
      date: classInfo.date,
      locationId: classInfo.locationId,
      instructorId: classInfo.instructorId,
    },
  });
}
