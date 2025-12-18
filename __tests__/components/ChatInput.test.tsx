import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from '../../components/ChatInput';

describe('ChatInput', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field and send button', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    expect(screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted', async () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i);
    await userEvent.type(input, 'Test message');

    const form = screen.getByRole('button').closest('form');
    fireEvent.submit(form!);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('clears input after sending message', async () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i) as HTMLInputElement;
    await userEvent.type(input, 'Test message');

    const form = screen.getByRole('button').closest('form');
    fireEvent.submit(form!);

    expect(input.value).toBe('');
  });

  it('disables input and button when loading', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);

    const input = screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i);
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('does not send empty messages', async () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i);
    await userEvent.type(input, '   ');

    const form = screen.getByRole('button').closest('form');
    fireEvent.submit(form!);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<ChatInput onSendMessage={mockOnSendMessage} isLoading={true} />);

    const spinner = screen.getByRole('button').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
