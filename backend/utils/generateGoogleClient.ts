import { getIntegrationDetails } from "./getIntegrationDetails.js";
import { decrypt, encrypt } from "./encryptDecrypt.js";
import { google } from "googleapis";
import dayjs from "dayjs";
import prisma from "./prismaClient.js";

export const generateGoogleClient = async (userEmail: string) => {
  const integrations = await getIntegrationDetails(userEmail);
  if (!integrations) {
    console.error("No integrations found");
    return null;
  }

  const integrationId = integrations.id;
  const accessToken = decrypt(integrations.token, integrations.tokenIv);
  const refreshToken = decrypt(
    integrations.refreshToken,
    integrations.refreshTokenIv
  );
  const expireAt = integrations.expiresAt;

  const auth = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_ID,
    process.env.NEXT_PUBLIC_GOOGLE_SECRET
  );

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expireAt,
  });

  if (!expireAt) return auth;

  const isTokenExpired = dayjs(expireAt * 1000).isBefore(new Date());

  if (isTokenExpired) {
    console.log("token is expired");
    try {
      const { credentials } = await auth.refreshAccessToken(); // gives me invalid grant instead of refreshing the token, should i give it an argument?
      const { access_token, expiry_date, refresh_token } = credentials;

      let encryptedAccessToken;
      let encryptedRefreshToken;
      if (access_token) encryptedAccessToken = encrypt(access_token);
      if (refresh_token) encryptedRefreshToken = encrypt(refresh_token);
      try {
        if (!encryptedAccessToken || !encryptedRefreshToken) {
          console.log("There was a problem encrypting tokens.");
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
            expiresAt: expiry_date
              ? Math.floor(expiry_date / 1000)
              : (undefined as number | undefined),
          },
        });

        auth.setCredentials({
          access_token,
          refresh_token,
          expiry_date,
        });

        return auth;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        return;
      }
    } catch (err) {
      console.error("Error refreshing access token: ", err);
    }
  } else {
    return auth;
  }
};
