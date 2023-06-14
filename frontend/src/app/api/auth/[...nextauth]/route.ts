import { postData } from '@/utilities/serverRequests/serverRequests';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

interface IGoogleProvider {
  clientId: string;
  clientSecret: string;
  authorization: IAuthorizationOptions;
}

interface IProviders {
  GoogleProvider: IGoogleProvider;
}

interface IAuthorizationOptions {
  params: {
    prompt: string;
    access_type: string;
    response_type: string;
    scope: string;
  };
}

const AuthorizationParams: IAuthorizationOptions = {
  params: {
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
    scope:
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
  },
};

const googleProviderOptions: IGoogleProvider = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
  clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as string,
  authorization: AuthorizationParams,
};

const authOptions: IProviders = {
  GoogleProvider: googleProviderOptions,
};

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [GoogleProvider(authOptions.GoogleProvider)],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn(user) {
      const { email } = user.user;
      if (user.account) {
        const { provider, access_token, expires_at, refresh_token } = user.account;
        await postData('/integration', {
          token: access_token,
          refreshToken: refresh_token,
          expiresAt: expires_at,
          userEmail: email,
          provider,
        });
      }
      return true;
    },

    async session({ session }) {
      return session;
    },

    redirect({ url, baseUrl }) {
      return process.env.NEXT_PUBLIC_BASE_URL || baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
