import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton from '@/components/dashboard/Skeleton';

describe('Skeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders four placeholder rows', () => {
    const { container } = render(<Skeleton />);
    const rows = container.querySelectorAll('.animate-pulse');
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });
});
