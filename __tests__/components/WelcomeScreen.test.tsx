import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WelcomeScreen from '../../components/WelcomeScreen';

describe('WelcomeScreen', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome title', () => {
    render(<WelcomeScreen onSendMessage={mockOnSendMessage} />);
    expect(screen.getByText('Z-CORE System Online')).toBeInTheDocument();
  });

  it('renders example prompts', () => {
    render(<WelcomeScreen onSendMessage={mockOnSendMessage} />);

    expect(screen.getByText(/오늘의 날씨는 어때/i)).toBeInTheDocument();
    expect(screen.getByText(/Z-CORE 시스템의 철학/i)).toBeInTheDocument();
    expect(screen.getByText(/시골 생활에 도움/i)).toBeInTheDocument();
    expect(screen.getByText(/이순신 페르소나/i)).toBeInTheDocument();
  });

  it('calls onSendMessage when example prompt is clicked', () => {
    render(<WelcomeScreen onSendMessage={mockOnSendMessage} />);

    const firstPrompt = screen.getByText(/오늘의 날씨는 어때/i);
    fireEvent.click(firstPrompt);

    expect(mockOnSendMessage).toHaveBeenCalledWith('오늘의 날씨는 어때?');
  });

  it('renders all 4 example prompts', () => {
    render(<WelcomeScreen onSendMessage={mockOnSendMessage} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });
});
