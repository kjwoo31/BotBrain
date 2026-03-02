import { MockStore } from './mock-store';

type Filter = {
  field: string;
  op: 'eq' | 'neq' | 'gte' | 'in';
  value: unknown;
};

type Operation = 'select' | 'insert' | 'update' | 'delete';

/**
 * Chainable query builder that mimics Supabase's PostgREST API.
 * Implements the Thenable pattern so `await builder.eq(...)` resolves automatically.
 */
export class MockQueryBuilder {
  private filters: Filter[] = [];
  private orderOpt?: { field: string; ascending: boolean };
  private limitCount?: number;
  private isSingle = false;
  private selectAfterMutation = false;
  private selectColumns = '*';

  constructor(
    private tableName: string,
    private operation: Operation,
    private columns: string = '*',
    private insertData?: Record<string, unknown> | Record<string, unknown>[],
    private updateData?: Record<string, unknown>,
  ) {
    if (operation === 'select') {
      this.selectColumns = columns;
    }
  }

  eq(field: string, value: unknown): this {
    this.filters.push({ field, op: 'eq', value });
    return this;
  }

  neq(field: string, value: unknown): this {
    this.filters.push({ field, op: 'neq', value });
    return this;
  }

  gte(field: string, value: unknown): this {
    this.filters.push({ field, op: 'gte', value });
    return this;
  }

  in(field: string, values: unknown[]): this {
    this.filters.push({ field, op: 'in', value: values });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }): this {
    this.orderOpt = { field, ascending: options?.ascending ?? true };
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  single(): this {
    this.isSingle = true;
    return this;
  }

  /**
   * After insert/update, `.select()` requests the mutated rows back.
   * After `from()`, `.select()` starts a read query (handled by MockFromBuilder).
   */
  select(_columns?: string): this {
    this.selectAfterMutation = true;
    if (_columns) this.selectColumns = _columns;
    return this;
  }

  /** Thenable: makes `await queryBuilder` resolve to `{ data, error }` */
  then(
    onfulfilled?: ((value: { data: unknown; error: unknown }) => unknown) | null,
    onrejected?: ((reason: unknown) => unknown) | null,
  ) {
    try {
      const result = this.execute();
      return Promise.resolve(result).then(onfulfilled, onrejected);
    } catch (e) {
      return Promise.reject(e).then(onfulfilled, onrejected);
    }
  }

  private execute(): { data: unknown; error: unknown } {
    const store = MockStore.getInstance();

    switch (this.operation) {
      case 'select': {
        let rows = store.getTable(this.tableName);
        rows = store.applyFilters([...rows], this.filters);
        rows = store.applyOrder(rows, this.orderOpt);

        // Relation joins: e.g. select('*, waypoints(*)')
        const relations = this.parseRelations(this.selectColumns);
        if (relations.length > 0) {
          rows = rows.map((row) => {
            const extended = { ...row };
            for (const rel of relations) {
              const relRows = store.getTable(rel);
              const fk = `${this.tableName.replace(/s$/, '')}_id`;
              extended[rel] = relRows.filter((r) => r[fk] === row['id']);
            }
            return extended;
          });
        }

        // Column filtering (select specific columns like 'name, robot_id')
        if (this.selectColumns !== '*' && relations.length === 0) {
          const cols = this.selectColumns.split(',').map((c) => c.trim());
          rows = rows.map((row) => {
            const filtered: Record<string, unknown> = {};
            for (const col of cols) {
              if (col in row) filtered[col] = row[col];
            }
            return filtered;
          });
        }

        if (this.limitCount != null) {
          rows = rows.slice(0, this.limitCount);
        }

        if (this.isSingle) {
          if (rows.length === 0) {
            return { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
          }
          return { data: rows[0], error: null };
        }

        return { data: rows, error: null };
      }

      case 'insert': {
        const items = Array.isArray(this.insertData) ? this.insertData : [this.insertData!];
        const inserted = items.map((item) => store.insertRow(this.tableName, item));
        const result = this.isSingle ? inserted[0] : inserted;
        return { data: this.selectAfterMutation ? result : null, error: null };
      }

      case 'update': {
        const updated = store.updateRows(this.tableName, this.updateData!, this.filters);
        if (this.selectAfterMutation) {
          if (this.isSingle) {
            return { data: updated[0] ?? null, error: null };
          }
          return { data: updated, error: null };
        }
        return { data: null, error: null };
      }

      case 'delete': {
        store.deleteRows(this.tableName, this.filters);
        return { data: null, error: null };
      }

      default:
        return { data: null, error: { message: `Unknown operation: ${this.operation}` } };
    }
  }

  /** Parse relation patterns like 'waypoints(*)' from select columns */
  private parseRelations(columns: string): string[] {
    const matches = columns.match(/(\w+)\(\*\)/g);
    return matches ? matches.map((m) => m.replace('(*)', '')) : [];
  }
}
