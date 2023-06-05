import { getIntegrationDetails } from "./getIntegrationDetails.js";
import { decrypt } from "./encryptDecrypt.js";
import { google } from "googleapis";
import dayjs from "dayjs";
import prisma from "./prismaClient.js";

export const generateGoogleClient = async (userEmail:string) => {
  const integrations = await getIntegrationDetails(userEmail)
  const integrationId = integrations[0].id
  const accessToken = decrypt(integrations[0].token);
  const refreshToken = decrypt(integrations[0].refreshToken);
  const expireAt = integrations[0].expiresAt

  if(!integrations) {
    return null
  }

  console.log(process.env.NEXT_PUBLIC_GOOGLE_ID)
  console.log(process.env.NEXT_PUBLIC_GOOGLE_SECRET)
  const auth = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_ID,
    process.env.NEXT_PUBLIC_GOOGLE_SECRET,
  )

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expireAt,
  })

  if (!expireAt) return auth

  const isTokenExpired = dayjs(expireAt * 1000).isBefore(new Date())

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()
    const {
      access_token,
      expiry_date,
      refresh_token,
    } = credentials

    try {
      await prisma.integration.update({
        where: {
          id: integrationId,
        },
        data: {
          token: access_token as string,
          refreshToken: refresh_token as string,
          expiresAt: expiry_date ? Math.floor(expiry_date / 1000) : undefined as number | undefined,
        },
      })
      
      auth.setCredentials({
        access_token,
        refresh_token,
        expiry_date,
      })

      return

    } catch (error:any) {
      console.log(error)
      return;
    }
  } else {
    return auth
  }
};