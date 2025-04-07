import Client from '../interfaces/Client';
import { PrismaService } from '../prisma/prisma.service';

export async function checkClientExists(
  prisma: PrismaService,
  clientInfo: Client,
): Promise<boolean> {
  const existingClient: Client = await prisma.client.findFirst({
    where: {
      email: clientInfo.email,
    },
  });

  return !!existingClient;
}
