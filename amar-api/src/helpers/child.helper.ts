import Child from '../interfaces/Child';
import Family from '../interfaces/Family';
import { PrismaService } from '../prisma/prisma.service';

export async function checkChildExists(
  prismaService: PrismaService,
  childInfo: Child,
): Promise<boolean> {
  const childExists: Child = await prismaService.child.findFirst({
    where: {
      name: childInfo.name,
      parents: {
        some: {
          clientId: {
            in: childInfo.parentId,
          },
        },
      },
    },
  });

  return !!childExists;
}
