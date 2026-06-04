import { describe, it, expect } from 'vitest';
import { getErrorStatus, toErrorInfo } from '@/utils/error';
import { ApiError } from '@/services/api';

describe('getErrorStatus', () => {
  it('returns the HTTP status from an ApiError', () => {
    expect(getErrorStatus(new ApiError(404, 'Not found'))).toBe(404);
    expect(getErrorStatus(new ApiError(401, 'Unauthorized'))).toBe(401);
    expect(getErrorStatus(new ApiError(500, 'Server error'))).toBe(500);
    expect(getErrorStatus(new ApiError(403, 'Forbidden'))).toBe(403);
  });

  it('returns 500 for a generic Error', () => {
    expect(getErrorStatus(new Error('oops'))).toBe(500);
  });

  it('returns 500 for non-Error values', () => {
    expect(getErrorStatus('a string')).toBe(500);
    expect(getErrorStatus(null)).toBe(500);
    expect(getErrorStatus(undefined)).toBe(500);
    expect(getErrorStatus(42)).toBe(500);
    expect(getErrorStatus({ code: 400 })).toBe(500);
  });
});

describe('toErrorInfo', () => {
  it('extracts status and message from an ApiError', () => {
    const info = toErrorInfo(new ApiError(403, 'Forbidden'));
    expect(info.status).toBe(403);
    expect(info.message).toBe('Forbidden');
  });

  it('uses status 500 and the Error message for a generic Error', () => {
    const info = toErrorInfo(new Error('something broke'));
    expect(info.status).toBe(500);
    expect(info.message).toBe('something broke');
  });

  it('uses the fallback message for non-Error values', () => {
    expect(toErrorInfo('raw string').message).toBe('An unexpected error occurred');
    expect(toErrorInfo(null).message).toBe('An unexpected error occurred');
  });

  it('always returns an object with status and message', () => {
    const info = toErrorInfo(undefined);
    expect(typeof info.status).toBe('number');
    expect(typeof info.message).toBe('string');
  });
});
