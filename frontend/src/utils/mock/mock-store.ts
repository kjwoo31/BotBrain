export const MOCK_USER_ID = 'mock-user-00000000-0000-0000-0000-000000000001';

type Filter = {
  field: string;
  op: 'eq' | 'neq' | 'gte' | 'in';
  value: unknown;
};

type OrderOption = { field: string; ascending: boolean };

export class MockStore {
  private static instance: MockStore;
  private tables: Map<string, Record<string, unknown>[]> = new Map();

  private constructor() {
    this.seed();
  }

  static getInstance(): MockStore {
    if (!MockStore.instance) {
      MockStore.instance = new MockStore();
    }
    return MockStore.instance;
  }

  private seed() {
    const now = new Date().toISOString();

    // ── robots (6대: go2×2, g1×2, tita×2) ──
    this.tables.set('robots', [
      {
        id: 'robot-001', user_id: MOCK_USER_ID,
        name: 'Scout Alpha', address: '192.168.1.95', type: 'go2',
        key: null, is_favorite: true,
        created_at: '2025-12-01T09:00:00.000Z', updated_at: '2026-01-15T10:30:00.000Z',
      },
      {
        id: 'robot-002', user_id: MOCK_USER_ID,
        name: 'Titan Beta', address: '192.168.1.100', type: 'g1',
        key: null, is_favorite: false,
        created_at: '2025-12-15T14:00:00.000Z', updated_at: '2026-01-20T08:00:00.000Z',
      },
      {
        id: 'robot-003', user_id: MOCK_USER_ID,
        name: 'Pathfinder Gamma', address: '192.168.1.110', type: 'tita',
        key: null, is_favorite: false,
        created_at: '2026-01-10T11:00:00.000Z', updated_at: '2026-02-01T16:00:00.000Z',
      },
      {
        id: 'robot-004', user_id: MOCK_USER_ID,
        name: 'Vanguard Delta', address: '192.168.1.120', type: 'go2',
        key: null, is_favorite: false,
        created_at: '2026-01-20T08:00:00.000Z', updated_at: '2026-02-15T12:00:00.000Z',
      },
      {
        id: 'robot-005', user_id: MOCK_USER_ID,
        name: 'Sentinel Epsilon', address: '192.168.1.130', type: 'g1',
        key: null, is_favorite: false,
        created_at: '2026-02-01T10:00:00.000Z', updated_at: '2026-02-20T09:00:00.000Z',
      },
      {
        id: 'robot-006', user_id: MOCK_USER_ID,
        name: 'Nomad Zeta', address: '192.168.1.140', type: 'tita',
        key: null, is_favorite: false,
        created_at: '2026-02-10T13:00:00.000Z', updated_at: '2026-02-28T17:00:00.000Z',
      },
    ]);

    // ── user_profiles ──
    this.tables.set('user_profiles', [
      {
        id: 'profile-001', user_id: MOCK_USER_ID,
        name: 'Demo User', avatar_url: null,
        theme_color: '#7c3aed', hide_branding: false,
        audit_logging_enabled: true, connection_timeout: 20000, speed_mode: 'normal',
        created_at: '2025-12-01T00:00:00.000Z', updated_at: now,
      },
    ]);

    // ── audit_logs (30일치, 6대 로봇 활동 + 시스템 이벤트) ──
    this.tables.set('audit_logs', MockStore.generateAuditLogs());

    // ── missions (로봇별 1~2개, 총 7개) ──
    this.tables.set('missions', [
      {
        id: 'mission-001', user_id: MOCK_USER_ID, robot_id: 'robot-001',
        name: 'Warehouse Patrol',
        description: 'Automated patrol route through warehouse zones A-C',
        map_name: 'warehouse_floor1', is_active: true,
        created_at: '2026-02-20T10:00:00.000Z', updated_at: '2026-03-01T14:00:00.000Z',
      },
      {
        id: 'mission-002', user_id: MOCK_USER_ID, robot_id: 'robot-002',
        name: 'Facility Inspection',
        description: 'Daily inspection of facility perimeter and entry points',
        map_name: 'facility_outdoor', is_active: false,
        created_at: '2026-02-25T09:00:00.000Z', updated_at: '2026-02-28T11:00:00.000Z',
      },
      {
        id: 'mission-003', user_id: MOCK_USER_ID, robot_id: 'robot-003',
        name: 'Perimeter Sweep',
        description: 'Continuous perimeter monitoring along fence line',
        map_name: 'campus_perimeter', is_active: true,
        created_at: '2026-02-18T07:00:00.000Z', updated_at: '2026-03-01T08:00:00.000Z',
      },
      {
        id: 'mission-004', user_id: MOCK_USER_ID, robot_id: 'robot-004',
        name: 'Loading Dock Monitor',
        description: 'Monitor loading dock area for incoming deliveries',
        map_name: 'warehouse_floor1', is_active: false,
        created_at: '2026-02-22T11:00:00.000Z', updated_at: '2026-02-27T15:00:00.000Z',
      },
      {
        id: 'mission-005', user_id: MOCK_USER_ID, robot_id: 'robot-005',
        name: 'Lab Safety Check',
        description: 'Automated safety inspection of laboratory corridors',
        map_name: 'lab_building_b2', is_active: true,
        created_at: '2026-02-26T09:00:00.000Z', updated_at: '2026-03-02T06:00:00.000Z',
      },
      {
        id: 'mission-006', user_id: MOCK_USER_ID, robot_id: 'robot-006',
        name: 'Outdoor Terrain Survey',
        description: 'Survey outdoor terrain for obstacle mapping',
        map_name: 'outdoor_field_a', is_active: false,
        created_at: '2026-02-15T14:00:00.000Z', updated_at: '2026-02-20T10:00:00.000Z',
      },
      {
        id: 'mission-007', user_id: MOCK_USER_ID, robot_id: 'robot-001',
        name: 'Night Watch',
        description: 'Overnight security patrol with thermal camera',
        map_name: 'warehouse_floor1', is_active: false,
        created_at: '2026-02-28T22:00:00.000Z', updated_at: '2026-03-01T06:00:00.000Z',
      },
    ]);

    // ── waypoints (미션별 3~5개) ──
    this.tables.set('waypoints', [
      // mission-001: Warehouse Patrol (3 waypoints, 2 reached)
      { id: 'wp-001', mission_id: 'mission-001', x: 0.0, y: 0.0, theta: 0.0, order_index: 0,
        is_reached: true, reached_at: '2026-03-01T14:01:00.000Z',
        created_at: '2026-02-20T10:00:00.000Z', updated_at: '2026-03-01T14:01:00.000Z' },
      { id: 'wp-002', mission_id: 'mission-001', x: 2.5, y: 1.0, theta: 1.57, order_index: 1,
        is_reached: true, reached_at: '2026-03-01T14:03:00.000Z',
        created_at: '2026-02-20T10:00:00.000Z', updated_at: '2026-03-01T14:03:00.000Z' },
      { id: 'wp-003', mission_id: 'mission-001', x: 5.0, y: 3.0, theta: 3.14, order_index: 2,
        is_reached: false, reached_at: null,
        created_at: '2026-02-20T10:00:00.000Z', updated_at: null },
      // mission-002: Facility Inspection (4 waypoints)
      { id: 'wp-004', mission_id: 'mission-002', x: 0.0, y: 0.0, theta: 0.0, order_index: 0,
        is_reached: false, reached_at: null,
        created_at: '2026-02-25T09:00:00.000Z', updated_at: null },
      { id: 'wp-005', mission_id: 'mission-002', x: 10.0, y: 0.0, theta: 0.0, order_index: 1,
        is_reached: false, reached_at: null,
        created_at: '2026-02-25T09:00:00.000Z', updated_at: null },
      { id: 'wp-006', mission_id: 'mission-002', x: 10.0, y: 10.0, theta: 1.57, order_index: 2,
        is_reached: false, reached_at: null,
        created_at: '2026-02-25T09:00:00.000Z', updated_at: null },
      { id: 'wp-007', mission_id: 'mission-002', x: 0.0, y: 10.0, theta: 3.14, order_index: 3,
        is_reached: false, reached_at: null,
        created_at: '2026-02-25T09:00:00.000Z', updated_at: null },
      // mission-003: Perimeter Sweep (5 waypoints, 3 reached)
      { id: 'wp-008', mission_id: 'mission-003', x: 0.0, y: 0.0, theta: 0.0, order_index: 0,
        is_reached: true, reached_at: '2026-03-01T08:01:00.000Z',
        created_at: '2026-02-18T07:00:00.000Z', updated_at: '2026-03-01T08:01:00.000Z' },
      { id: 'wp-009', mission_id: 'mission-003', x: 15.0, y: 0.0, theta: 0.0, order_index: 1,
        is_reached: true, reached_at: '2026-03-01T08:05:00.000Z',
        created_at: '2026-02-18T07:00:00.000Z', updated_at: '2026-03-01T08:05:00.000Z' },
      { id: 'wp-010', mission_id: 'mission-003', x: 15.0, y: 20.0, theta: 1.57, order_index: 2,
        is_reached: true, reached_at: '2026-03-01T08:10:00.000Z',
        created_at: '2026-02-18T07:00:00.000Z', updated_at: '2026-03-01T08:10:00.000Z' },
      { id: 'wp-011', mission_id: 'mission-003', x: 0.0, y: 20.0, theta: 3.14, order_index: 3,
        is_reached: false, reached_at: null,
        created_at: '2026-02-18T07:00:00.000Z', updated_at: null },
      { id: 'wp-012', mission_id: 'mission-003', x: 0.0, y: 0.0, theta: 4.71, order_index: 4,
        is_reached: false, reached_at: null,
        created_at: '2026-02-18T07:00:00.000Z', updated_at: null },
      // mission-004: Loading Dock Monitor (3 waypoints)
      { id: 'wp-013', mission_id: 'mission-004', x: 1.0, y: 0.0, theta: 0.0, order_index: 0,
        is_reached: false, reached_at: null,
        created_at: '2026-02-22T11:00:00.000Z', updated_at: null },
      { id: 'wp-014', mission_id: 'mission-004', x: 4.0, y: 2.0, theta: 0.78, order_index: 1,
        is_reached: false, reached_at: null,
        created_at: '2026-02-22T11:00:00.000Z', updated_at: null },
      { id: 'wp-015', mission_id: 'mission-004', x: 1.0, y: 4.0, theta: 2.35, order_index: 2,
        is_reached: false, reached_at: null,
        created_at: '2026-02-22T11:00:00.000Z', updated_at: null },
      // mission-005: Lab Safety Check (4 waypoints, 1 reached)
      { id: 'wp-016', mission_id: 'mission-005', x: 0.0, y: 0.0, theta: 0.0, order_index: 0,
        is_reached: true, reached_at: '2026-03-02T06:02:00.000Z',
        created_at: '2026-02-26T09:00:00.000Z', updated_at: '2026-03-02T06:02:00.000Z' },
      { id: 'wp-017', mission_id: 'mission-005', x: 8.0, y: 0.0, theta: 0.0, order_index: 1,
        is_reached: false, reached_at: null,
        created_at: '2026-02-26T09:00:00.000Z', updated_at: null },
      { id: 'wp-018', mission_id: 'mission-005', x: 8.0, y: 6.0, theta: 1.57, order_index: 2,
        is_reached: false, reached_at: null,
        created_at: '2026-02-26T09:00:00.000Z', updated_at: null },
      { id: 'wp-019', mission_id: 'mission-005', x: 0.0, y: 6.0, theta: 3.14, order_index: 3,
        is_reached: false, reached_at: null,
        created_at: '2026-02-26T09:00:00.000Z', updated_at: null },
      // mission-006: Outdoor Terrain Survey (4 waypoints)
      { id: 'wp-020', mission_id: 'mission-006', x: 0.0, y: 0.0, theta: 0.0, order_index: 0,
        is_reached: false, reached_at: null,
        created_at: '2026-02-15T14:00:00.000Z', updated_at: null },
      { id: 'wp-021', mission_id: 'mission-006', x: 20.0, y: 5.0, theta: 0.39, order_index: 1,
        is_reached: false, reached_at: null,
        created_at: '2026-02-15T14:00:00.000Z', updated_at: null },
      { id: 'wp-022', mission_id: 'mission-006', x: 20.0, y: 15.0, theta: 1.57, order_index: 2,
        is_reached: false, reached_at: null,
        created_at: '2026-02-15T14:00:00.000Z', updated_at: null },
      { id: 'wp-023', mission_id: 'mission-006', x: 5.0, y: 15.0, theta: 2.74, order_index: 3,
        is_reached: false, reached_at: null,
        created_at: '2026-02-15T14:00:00.000Z', updated_at: null },
      // mission-007: Night Watch (3 waypoints)
      { id: 'wp-024', mission_id: 'mission-007', x: 0.0, y: 0.0, theta: 0.0, order_index: 0,
        is_reached: false, reached_at: null,
        created_at: '2026-02-28T22:00:00.000Z', updated_at: null },
      { id: 'wp-025', mission_id: 'mission-007', x: 6.0, y: 4.0, theta: 0.78, order_index: 1,
        is_reached: false, reached_at: null,
        created_at: '2026-02-28T22:00:00.000Z', updated_at: null },
      { id: 'wp-026', mission_id: 'mission-007', x: 0.0, y: 4.0, theta: 3.14, order_index: 2,
        is_reached: false, reached_at: null,
        created_at: '2026-02-28T22:00:00.000Z', updated_at: null },
    ]);

    // ── yolo_data (AI detection records) ──
    this.tables.set('yolo_data', [
      { id: 'yolo-001', user_id: MOCK_USER_ID, robot_id: 'robot-001', label: 'person', confidence_score: 0.94, created_at: '2026-02-28T10:00:00.000Z' },
      { id: 'yolo-002', user_id: MOCK_USER_ID, robot_id: 'robot-001', label: 'forklift', confidence_score: 0.87, created_at: '2026-02-28T10:05:00.000Z' },
      { id: 'yolo-003', user_id: MOCK_USER_ID, robot_id: 'robot-002', label: 'person', confidence_score: 0.91, created_at: '2026-02-28T11:00:00.000Z' },
      { id: 'yolo-004', user_id: MOCK_USER_ID, robot_id: 'robot-003', label: 'vehicle', confidence_score: 0.82, created_at: '2026-03-01T08:30:00.000Z' },
      { id: 'yolo-005', user_id: MOCK_USER_ID, robot_id: 'robot-005', label: 'person', confidence_score: 0.96, created_at: '2026-03-01T09:00:00.000Z' },
      { id: 'yolo-006', user_id: MOCK_USER_ID, robot_id: 'robot-004', label: 'box', confidence_score: 0.78, created_at: '2026-03-01T14:20:00.000Z' },
      { id: 'yolo-007', user_id: MOCK_USER_ID, robot_id: 'robot-006', label: 'cone', confidence_score: 0.85, created_at: '2026-03-02T07:15:00.000Z' },
      { id: 'yolo-008', user_id: MOCK_USER_ID, robot_id: 'robot-001', label: 'person', confidence_score: 0.92, created_at: '2026-03-02T08:10:00.000Z' },
    ]);

    // ── sound_clips ──
    this.tables.set('sound_clips', [
      { id: 'snd-001', user_id: MOCK_USER_ID, name: 'alert_beep.wav', file_size: 24576, created_at: '2026-01-10T00:00:00.000Z' },
      { id: 'snd-002', user_id: MOCK_USER_ID, name: 'mission_complete.mp3', file_size: 102400, created_at: '2026-01-15T00:00:00.000Z' },
      { id: 'snd-003', user_id: MOCK_USER_ID, name: 'warning_siren.wav', file_size: 51200, created_at: '2026-02-01T00:00:00.000Z' },
    ]);

    this.tables.set('dashboard_layouts', []);
  }

  /**
   * 30일치 audit_logs를 생성합니다.
   * 6대 로봇의 다양한 활동 로그 + 시스템 이벤트.
   * Dashboard heatmap / usage analytics가 풍부하게 표시되도록 합니다.
   */
  private static generateAuditLogs(): Record<string, unknown>[] {
    const robots = [
      { id: 'robot-001', name: 'Scout Alpha', address: '192.168.1.95', weight: 5 },
      { id: 'robot-002', name: 'Titan Beta', address: '192.168.1.100', weight: 4 },
      { id: 'robot-003', name: 'Pathfinder Gamma', address: '192.168.1.110', weight: 3 },
      { id: 'robot-004', name: 'Vanguard Delta', address: '192.168.1.120', weight: 3 },
      { id: 'robot-005', name: 'Sentinel Epsilon', address: '192.168.1.130', weight: 2 },
      { id: 'robot-006', name: 'Nomad Zeta', address: '192.168.1.140', weight: 2 },
    ];

    const robotEvents: [string, string, Record<string, unknown>?][] = [
      ['robot', 'robot_connect', undefined],
      ['robot', 'robot_disconnect', {}],
      ['command', 'mode_change', { mode: 'walk' }],
      ['command', 'mode_change', { mode: 'stand' }],
      ['mission', 'mission_started', undefined],
      ['mission', 'mission_stopped', undefined],
      ['navigation', 'navigation_goal_set', { x: 2.5, y: 1.0, theta: 0.0 }],
      ['navigation', 'navigation_goal_reached', { x: 2.5, y: 1.0 }],
      ['camera', 'camera_viewed', { stream: 'color' }],
      ['camera', 'camera_viewed', { stream: 'depth' }],
    ];

    const systemEvents: [string, string, Record<string, unknown>][] = [
      ['auth', 'login', { email: 'demo@botbrain.local' }],
      ['system', 'settings_updated', { changes: ['speed_mode'] }],
      ['system', 'settings_updated', { changes: ['theme_color'] }],
    ];

    const logs: Record<string, unknown>[] = [];
    let logIdx = 1;

    // Seed for deterministic pseudo-random: simple LCG
    let rng = 42;
    const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff; };

    // 30일 이전부터 오늘까지 로그 생성
    const today = new Date('2026-03-02T23:59:59.000Z');
    for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
      const baseDate = new Date(today);
      baseDate.setDate(baseDate.getDate() - dayOffset);

      // 하루 당 이벤트 수: 평일(월~금)에 더 많은 활동
      const dayOfWeek = baseDate.getDay();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const dailyEvents = isWeekday ? 8 + Math.floor(rand() * 6) : 2 + Math.floor(rand() * 4);

      // 하루 시작: 로그인
      const loginHour = 7 + Math.floor(rand() * 2);
      logs.push({
        id: `log-${String(logIdx++).padStart(3, '0')}`, user_id: MOCK_USER_ID,
        event_type: 'auth', event_action: 'login',
        event_details: { email: 'demo@botbrain.local' },
        robot_id: null, robot_name: null,
        ip_address: '127.0.0.1', user_agent: 'MockBrowser',
        created_at: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), loginHour, 0, 0).toISOString(),
      });

      // 로봇 이벤트 분배
      for (let e = 0; e < dailyEvents; e++) {
        // weight 기반 로봇 선택
        const totalWeight = robots.reduce((s, r) => s + r.weight, 0);
        let pick = rand() * totalWeight;
        let robot = robots[0];
        for (const r of robots) {
          pick -= r.weight;
          if (pick <= 0) { robot = r; break; }
        }

        const hour = 8 + Math.floor(rand() * 12); // 08:00 ~ 20:00
        const minute = Math.floor(rand() * 60);
        const evtPair = robotEvents[Math.floor(rand() * robotEvents.length)];

        const details = evtPair[2] !== undefined
          ? { ...evtPair[2] }
          : evtPair[1] === 'robot_connect'
            ? { address: robot.address }
            : evtPair[1] === 'mission_started'
              ? { mission_name: 'Auto-generated mission' }
              : {};

        logs.push({
          id: `log-${String(logIdx++).padStart(3, '0')}`, user_id: MOCK_USER_ID,
          event_type: evtPair[0], event_action: evtPair[1],
          event_details: details,
          robot_id: robot.id, robot_name: robot.name,
          ip_address: '127.0.0.1', user_agent: 'MockBrowser',
          created_at: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hour, minute, 0).toISOString(),
        });
      }

      // 가끔 시스템 이벤트
      if (rand() > 0.6) {
        const sysEvt = systemEvents[Math.floor(rand() * systemEvents.length)];
        logs.push({
          id: `log-${String(logIdx++).padStart(3, '0')}`, user_id: MOCK_USER_ID,
          event_type: sysEvt[0], event_action: sysEvt[1],
          event_details: { ...sysEvt[2] },
          robot_id: null, robot_name: null,
          ip_address: '127.0.0.1', user_agent: 'MockBrowser',
          created_at: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 17 + Math.floor(rand() * 3), Math.floor(rand() * 60), 0).toISOString(),
        });
      }
    }

    return logs;
  }

  getTable(name: string): Record<string, unknown>[] {
    if (!this.tables.has(name)) {
      this.tables.set(name, []);
    }
    return this.tables.get(name)!;
  }

  applyFilters(rows: Record<string, unknown>[], filters: Filter[]): Record<string, unknown>[] {
    return rows.filter((row) =>
      filters.every((f) => {
        const val = row[f.field];
        switch (f.op) {
          case 'eq':
            return val === f.value;
          case 'neq':
            return val !== f.value;
          case 'gte':
            return typeof val === 'string' && typeof f.value === 'string'
              ? val >= f.value
              : Number(val) >= Number(f.value);
          case 'in':
            return Array.isArray(f.value) && f.value.includes(val);
          default:
            return true;
        }
      })
    );
  }

  applyOrder(rows: Record<string, unknown>[], order?: OrderOption): Record<string, unknown>[] {
    if (!order) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[order.field];
      const bVal = b[order.field];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal));
      return order.ascending ? cmp : -cmp;
    });
  }

  insertRow(table: string, data: Record<string, unknown>): Record<string, unknown> {
    const rows = this.getTable(table);
    const row = {
      id: data.id ?? crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    rows.push(row);
    return row;
  }

  updateRows(table: string, updates: Record<string, unknown>, filters: Filter[]): Record<string, unknown>[] {
    const rows = this.getTable(table);
    const matched = this.applyFilters(rows, filters);
    for (const row of matched) {
      Object.assign(row, updates, { updated_at: new Date().toISOString() });
    }
    return matched;
  }

  deleteRows(table: string, filters: Filter[]): Record<string, unknown>[] {
    const rows = this.getTable(table);
    const toKeep: Record<string, unknown>[] = [];
    const deleted: Record<string, unknown>[] = [];
    for (const row of rows) {
      if (filters.every((f) => {
        const val = row[f.field];
        switch (f.op) {
          case 'eq': return val === f.value;
          case 'neq': return val !== f.value;
          case 'in': return Array.isArray(f.value) && f.value.includes(val);
          default: return true;
        }
      })) {
        deleted.push(row);
      } else {
        toKeep.push(row);
      }
    }
    this.tables.set(table, toKeep);
    return deleted;
  }
}
