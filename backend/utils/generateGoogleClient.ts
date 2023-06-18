import { getIntegrationDetails } from "./getIntegrationDetails.js";
import { decrypt, encrypt } from "./encryptDecrypt.js";
import { google } from "googleapis";
import dayjs from "dayjs";
import prisma from "./prismaClient.js";

export const generateGoogleClient = async (userEmail:string) => {
  const integrations = await getIntegrationDetails(userEmail)
  const integrationId = integrations[0].id
  const accessToken = decrypt(integrations[0].token, integrations[0].tokenIv);
  const refreshToken = decrypt(integrations[0].refreshToken, integrations[0].refreshTokenIv);
  const expireAt = integrations[0].expiresAt

  if(!integrations) {
    return null
  }

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

    let encryptedAccessToken;
    let encryptedRefreshToken;
    if(access_token) encryptedAccessToken = encrypt(access_token)
    if(refresh_token) encryptedRefreshToken = encrypt(refresh_token)
    try {
      if(!encryptedAccessToken || !encryptedRefreshToken) {
        console.log('There was a problem encrypting tokens.')
        return;
      }
      await prisma.integration.update({
        where: {
          id: integrationId,
        },
        data: {
          token: encryptedAccessToken.encrypted,
          tokenIv: encryptedAccessToken.iv,
          refreshToken: encryptedRefreshToken.encrypted,
          refreshTokenIv: encryptedRefreshToken.iv,
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