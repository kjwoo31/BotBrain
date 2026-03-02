import { MOCK_USER_ID } from './mock-store';

const MOCK_USER = {
  id: MOCK_USER_ID,
  email: 'demo@botbrain.local',
  user_metadata: { name: 'Demo User' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2025-12-01T00:00:00.000Z',
  role: 'authenticated',
  updated_at: '2025-12-01T00:00:00.000Z',
};

const MOCK_SESSION = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: MOCK_USER,
};

export class MockAuth {
  async getSession() {
    return { data: { session: MOCK_SESSION }, error: null };
  }

  async getUser() {
    return { data: { user: MOCK_USER }, error: null };
  }

  async signInWithPassword(_credentials: { email: string; password: string }) {
    return { data: { user: MOCK_USER, session: MOCK_SESSION }, error: null };
  }

  async signUp(_credentials: { email: string; password: string; options?: unknown }) {
    return { data: { user: MOCK_USER, session: null }, error: null };
  }

  async signOut() {
    return { error: null };
  }

  async updateUser(attributes: Record<string, unknown>) {
    if (attributes.data && typeof attributes.data === 'object') {
      Object.assign(MOCK_USER.user_metadata, attributes.data);
    }
    return { data: { user: MOCK_USER }, error: null };
  }

  onAuthStateChange(callback: (event: string, session: typeof MOCK_SESSION | null) => void) {
    setTimeout(() => callback('SIGNED_IN', MOCK_SESSION), 0);
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }
}
