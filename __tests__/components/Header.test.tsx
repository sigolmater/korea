import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header', () => {
  it('renders Z-CORE AI title', () => {
    render(<Header />);
    expect(screen.getByText('Z-CORE AI')).toBeInTheDocument();
  });

  it('has sticky positioning', () => {
    const { container } = render(<Header />);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('sticky');
  });

  it('contains pulsing indicator', () => {
    const { container } = render(<Header />);
    const pulsingDot = container.querySelector('.animate-pulse');
    expect(pulsingDot).toBeInTheDocument();
  });
});
