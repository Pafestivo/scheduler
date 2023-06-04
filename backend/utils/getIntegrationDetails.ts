import prisma from './prismaClient.js';

export const getIntegrationDetails = async (userEmail:string) => {
  const integrationDetails = await prisma.integration.findMany({
    where: {
      userEmail,
      provider: 'google'
    }
  })
  return integrationDetails;
}