import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { AuthUser } from '../types/auth';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  token_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export class GoogleAuthService {
  private static discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');

  static async signInWithGoogle(): Promise<AuthUser> {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      const codeChallenge = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        'code-challenge',
        { encoding: Crypto.CryptoEncoding.BASE64URL }
      );

      const request = new AuthSession.AuthRequest({
        clientId: CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri,
        codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
        additionalParameters: {},
        extraParams: {
          access_type: 'offline',
        },
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      const result = await request.promptAsync(discovery);

      if (result.type === 'success' && result.params.code) {
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: CLIENT_ID,
            code: result.params.code,
            redirectUri,
            extraParams: {
              code_verifier: 'code-challenge',
            },
          },
          discovery
        );

        const userInfo = await this.getUserInfo(tokenResponse.accessToken);
        
        const authUser: AuthUser = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          profileImage: userInfo.picture,
          provider: 'google',
          favorites: [],
        };

        return authUser;
      }

      throw new Error('Google認証がキャンセルされました');
    } catch (error) {
      console.error('Google authentication error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Googleログインに失敗しました');
    }
  }

  private static async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }

    return await response.json();
  }
}