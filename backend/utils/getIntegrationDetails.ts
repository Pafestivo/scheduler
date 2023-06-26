import prisma from './prismaClient.js';

export const getIntegrationDetails = async (userHash: string) => {
  const integrationDetails = await prisma.integration.findFirst({
    where: {
      userHash,
      provider: 'google',
    },
  });
  return integrationDetails;
};
