import prisma from './prismaClient.js';

export const getIntegrationDetails = async (userEmail: string) => {
  console.log(userEmail)
  const integrationDetails = await prisma.integration.findFirst({
    where: {
      userEmail,
      provider: 'google',
    },
  });
  return integrationDetails;
};
