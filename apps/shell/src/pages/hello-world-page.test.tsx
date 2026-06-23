import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HelloWorldPage } from './hello-world-page';

describe('HelloWorldPage', () => {
  it('renders the generic shell welcome message', (): void => {
    render(<HelloWorldPage />);

    expect(screen.getByRole('heading', { name: 'Hello, world.' })).toBeInTheDocument();
  });
});
