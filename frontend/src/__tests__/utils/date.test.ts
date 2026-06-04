/** Tests for date formatting and comparison utilities. */

import { describe, it, expect } from 'vitest';
import {
  isToday, fmtTime, fmtDateLabel, toDateTimeLocal, nowDateTimeLocal,
} from '@/utils/date';

describe('isToday', () => {
  it('returns true for right now', () => {
    expect(isToday(new Date().toISOString())).toBe(true);
  });

  it('returns false for yesterday', () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    expect(isToday(d.toISOString())).toBe(false);
  });

  it('returns false for tomorrow', () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    expect(isToday(d.toISOString())).toBe(false);
  });

  it('returns false for a date far in the past', () => {
    expect(isToday('2000-01-01T00:00:00.000Z')).toBe(false);
  });
});

describe('fmtTime', () => {
  it('returns a non-empty string', () => {
    expect(fmtTime(new Date().toISOString()).length).toBeGreaterThan(0);
  });

  it('does not include a year or date component', () => {
    expect(fmtTime('2026-06-04T14:30:00.000Z')).not.toMatch(/2026/);
    expect(fmtTime('2026-06-04T14:30:00.000Z')).not.toMatch(/June/);
  });
});

describe('fmtDateLabel', () => {
  it('includes one of the weekday names', () => {
    const result   = fmtDateLabel('2026-06-04T00:00:00.000Z');
    const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    expect(weekdays.some(d => result.includes(d))).toBe(true);
  });

  it('includes the year 2026', () => {
    expect(fmtDateLabel('2026-06-04T00:00:00.000Z')).toContain('2026');
  });
});

describe('toDateTimeLocal', () => {
  it('returns YYYY-MM-DDTHH:mm format', () => {
    expect(toDateTimeLocal('2026-06-15T14:30:00.000Z')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('does not include seconds or milliseconds', () => {
    const result = toDateTimeLocal('2026-06-15T14:30:45.123Z');
    expect(result).not.toContain(':45');
  });
});

describe('nowDateTimeLocal', () => {
  it('returns YYYY-MM-DDTHH:mm format', () => {
    expect(nowDateTimeLocal()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('reflects the current time within a 1-minute window', () => {
    const result  = nowDateTimeLocal();
    const diffMs  = Math.abs(new Date(result).getTime() - new Date().getTime());
    expect(diffMs).toBeLessThan(60_000);
  });
});
