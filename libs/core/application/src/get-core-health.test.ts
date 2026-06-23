import { describe, expect, it } from 'vitest';

import { getCoreHealth } from './get-core-health';

describe('getCoreHealth', () => {
  it('returns a deterministic health response from the injected clock', (): void => {
    const result = getCoreHealth({
      clock: { now: (): Date => new Date('2026-01-01T00:00:00.000Z') },
      service: 'core-api',
      version: '0.0.0',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        service: 'core-api',
        status: 'ok',
        timestamp: '2026-01-01T00:00:00.000Z',
        version: '0.0.0',
      },
    });
  });
});
