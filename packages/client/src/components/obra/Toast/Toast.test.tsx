import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render success toast with correct content', () => {
    render(
      <Toast
        id="test-toast"
        type="success"
        title="Success!"
        message="Operation completed successfully"
      />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render deleted toast with trash icon', () => {
    render(
      <Toast
        id="test-toast"
        type="deleted"
        title="Deleted"
        message='"Case ABC" case has been successfully deleted.'
      />
    );

    expect(screen.getByText('Deleted')).toBeInTheDocument();
    expect(screen.getByText('"Case ABC" case has been successfully deleted.')).toBeInTheDocument();
  });

  it('should show queue position when provided', () => {
    render(
      <Toast
        id="test-toast"
        type="success"
        title="Success!"
        message="Test message"
        queuePosition="1/3"
      />
    );

    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onDismiss = vi.fn();

    render(
      <Toast
        id="test-toast"
        type="success"
        title="Success!"
        message="Test message"
        onDismiss={onDismiss}
      />
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should auto-dismiss after duration', async () => {
    const onDismiss = vi.fn();

    render(
      <Toast
        id="test-toast"
        type="success"
        title="Success!"
        message="Test message"
        onDismiss={onDismiss}
        duration={3000}
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('should cancel auto-dismiss timer when manually dismissed', async () => {
    const user = userEvent.setup({ delay: null });
    const onDismiss = vi.fn();

    render(
      <Toast
        id="test-toast"
        type="success"
        title="Success!"
        message="Test message"
        onDismiss={onDismiss}
        duration={5000}
      />
    );

    vi.advanceTimersByTime(2000);

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5000);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should have correct accessibility attributes', () => {
    render(
      <Toast
        id="test-toast"
        type="success"
        title="Success!"
        message="Test message"
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveAttribute('data-testid', 'toast-test-toast');
  });

  it('should show toast emoji for success type', () => {
    render(
      <Toast
        id="test-toast"
        type="success"
        title="Success!"
        message="Test message"
      />
    );

    expect(screen.getByText('🍞')).toBeInTheDocument();
  });

  it('should show sparkles for success type', () => {
    const { container } = render(
      <Toast
        id="test-toast"
        type="success"
        title="Success!"
        message="Test message"
      />
    );

    const sparkles = container.querySelectorAll('.animate-sparkle-1, .animate-sparkle-2');
    expect(sparkles.length).toBe(2);
  });
});
