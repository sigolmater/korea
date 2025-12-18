import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatMessage from '../../components/ChatMessage';
import { MessageRole } from '../../types';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const message = {
      role: MessageRole.USER,
      content: 'Hello, this is a user message',
    };

    render(<ChatMessage message={message} />);
    expect(screen.getByText('Hello, this is a user message')).toBeInTheDocument();
  });

  it('renders model message correctly', () => {
    const message = {
      role: MessageRole.MODEL,
      content: 'Hello, this is a model response',
    };

    render(<ChatMessage message={message} />);
    expect(screen.getByText('Hello, this is a model response')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<ChatMessage isLoading={true} />);

    const loadingDots = screen.getByRole('generic').querySelectorAll('.animate-pulse');
    expect(loadingDots.length).toBeGreaterThan(0);
  });

  it('renders nothing when no message and not loading', () => {
    const { container } = render(<ChatMessage />);
    expect(container.firstChild).toBeNull();
  });

  it('applies different styles for user and model messages', () => {
    const userMessage = {
      role: MessageRole.USER,
      content: 'User message',
    };

    const { rerender } = render(<ChatMessage message={userMessage} />);
    const userContainer = screen.getByText('User message').closest('div');
    expect(userContainer).toHaveClass('bg-blue-600');

    const modelMessage = {
      role: MessageRole.MODEL,
      content: 'Model message',
    };

    rerender(<ChatMessage message={modelMessage} />);
    const modelContainer = screen.getByText('Model message').closest('div');
    expect(modelContainer).toHaveClass('bg-gray-800');
  });
});
