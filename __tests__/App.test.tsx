import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as geminiService from '../services/geminiService';

jest.mock('../services/geminiService');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome screen initially', () => {
    render(<App />);
    expect(screen.getByText(/Z-CORE System Online/i)).toBeInTheDocument();
  });

  it('displays user message after sending', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i);
    const sendButton = screen.getByRole('button', { name: '' });

    await userEvent.type(input, 'Hello Z-CORE');
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello Z-CORE')).toBeInTheDocument();
  });

  it('displays AI response after API call', async () => {
    const mockResponse = 'Hello! How can I help you?';
    (geminiService.getZCoreResponse as jest.Mock).mockResolvedValue(mockResponse);

    render(<App />);

    const input = screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i);
    await userEvent.type(input, 'Hello');

    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(mockResponse)).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    (geminiService.getZCoreResponse as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<App />);

    const input = screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i);
    await userEvent.type(input, 'Test message');

    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/system malfunction/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while processing', async () => {
    (geminiService.getZCoreResponse as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve('Response'), 100))
    );

    render(<App />);

    const input = screen.getByPlaceholderText(/Z-CORE에게 메시지 보내기/i);
    await userEvent.type(input, 'Test');

    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);

    expect(input).toBeDisabled();
  });
});
