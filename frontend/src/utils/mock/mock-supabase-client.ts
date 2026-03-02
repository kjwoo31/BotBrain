import { MockAuth } from './mock-auth';
import { MockQueryBuilder } from './mock-query-builder';

export function isMockMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

class MockFromBuilder {
  constructor(private table: string) {}

  select(columns: string = '*') {
    return new MockQueryBuilder(this.table, 'select', columns);
  }

  insert(data: Record<string, unknown> | Record<string, unknown>[]) {
    return new MockQueryBuilder(this.table, 'insert', '*', data);
  }

  update(data: Record<string, unknown>) {
    return new MockQueryBuilder(this.table, 'update', '*', undefined, data);
  }

  delete() {
    return new MockQueryBuilder(this.table, 'delete');
  }
}

class MockChannel {
  on(_event: string, _config: unknown, _callback?: Function) {
    return this;
  }
  subscribe() {
    return { unsubscribe: () => {} };
  }
}

class MockStorageBucket {
  async createSignedUrl(path: string, _expiresIn: number) {
    return { data: { signedUrl: `/mock-storage/${path}` }, error: null };
  }
  async upload(_path: string, _file: unknown) {
    return { data: { path: 'mock-upload-path' }, error: null };
  }
  async remove(_paths: string[]) {
    return { data: null, error: null };
  }
  getPublicUrl(path: string) {
    return { data: { publicUrl: `/mock-storage/${path}` } };
  }
}

export function createMockSupabaseClient() {
  const auth = new MockAuth();

  return {
    auth,
    from(table: string) {
      return new MockFromBuilder(table);
    },
    channel(_name: string) {
      return new MockChannel();
    },
    storage: {
      from(_bucket: string) {
        return new MockStorageBucket();
      },
    },
  };
}
