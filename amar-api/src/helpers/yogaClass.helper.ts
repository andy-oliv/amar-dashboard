import YogaClass from '../interfaces/YogaClass';
import { PrismaService } from '../prisma/prisma.service';

export async function checkClassExists(
  prismaService: PrismaService,
  classId: number,
) {
  const newClass: YogaClass = await prismaService.yogaClass.findFirst({
    where: {
      id: classId,
    },
  });

  return newClass;
}
