// Mock Supabase client to route queries securely to https://deltarq.com/scanner/v1/db
class MockSupabaseQuery {
  private table: string;
  private filters: { key: string; value: any }[] = [];

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    return this;
  }

  eq(key: string, value: any) {
    this.filters.push({ key, value });
    return this;
  }

  async single() {
    try {
      const response = await fetch('https://deltarq.com/scanner/v1/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'select_single',
          table: this.table,
          filters: this.filters
        })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        return { data: null, error: new Error(result.error || 'Fetch failed') };
      }
      return { data: result.data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async insert(rows: any[]) {
    try {
      const response = await fetch('https://deltarq.com/scanner/v1/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'insert',
          table: this.table,
          data: rows[0]
        })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        return { error: new Error(result.error || 'Insert failed') };
      }
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }

  async upsert(payload: any, options?: any) {
    try {
      const response = await fetch('https://deltarq.com/scanner/v1/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upsert',
          table: this.table,
          data: payload,
          onConflict: options?.onConflict
        })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        return { error: new Error(result.error || 'Upsert failed') };
      }
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }
}

export const supabase = {
  from: (table: string) => {
    return new MockSupabaseQuery(table);
  }
};
