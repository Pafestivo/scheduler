/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { Account, Profile, User as NextAuthUser } from 'next-auth';
import { Isession } from '@/utilities/types';
import { encrypt } from '@/utilities/encryptDecrypt';
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

interface IUser extends NextAuthUser {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

interface IAccount extends Account {
  access_token?: string;
  expires_at?: number;
  refresh_token?: string;
}
// interface INextAuthSignInParams {
//   user: IUser;
//   account: IAccount | null;
//   profile?: Profile;
//   email?: { verificationRequest?: boolean };
//   credentials?: Record<string, unknown>;
// }
interface INextAuthJwtParams {
  token: any;
  user: IUser | null;
  account: IAccount | null;
  profile?: Profile;
  isNewUser?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session?: any;
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [GoogleProvider(authOptions.GoogleProvider)],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, account }: INextAuthJwtParams) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }: { session: Isession; token: any }) {
      const encryptedToken = encrypt(token.accessToken);
      const encryptedRefreshToken = encrypt(token.refreshToken);
      session.accessToken = encryptedToken;
      session.refreshToken = encryptedRefreshToken;
      session.expiresAt = token.expiresAt;
      session.provider = token.provider;
      return session;
    },

    redirect({ url, baseUrl }) {
      const base = process.env.NEXT_PUBLIC_BASE_URL || baseUrl;
      if (url === '/api/auth/signout') {
        // On signout, redirect to base URL
        return base;
      } else {
        // On signin, redirect to dashboard
        return `${base}/dashboard`;
      }
    },
    
  },
});

export { handler as GET, handler as POST };
