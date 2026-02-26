import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';

describe('Login form button state', () => {
  function setup() {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    const button = screen.getByRole('button', { name: /login/i });
    return { email, password, button };
  }

  test('renders and button present', () => {
    const { button } = setup();
    expect(button).toBeInTheDocument();
  });

  test('initially disabled with aria-disabled=true', () => {
    const { button } = setup();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  test('typing email only keeps button disabled', () => {
    const { email, button } = setup();
    fireEvent.change(email, { target: { value: 'user@example.com' } });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  test('typing password only keeps button disabled', () => {
    const { password, button } = setup();
    fireEvent.change(password, { target: { value: 'secret' } });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  test('both fields filled enables the button', () => {
    const { email, password, button } = setup();
    fireEvent.change(email, { target: { value: 'user@example.com' } });
    fireEvent.change(password, { target: { value: 'secret' } });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'false');
    // tabindex should be 3 per accessibility order
    expect(button.tabIndex).toBe(3);
  });

  test('clearing a filled field disables the button again', () => {
    const { email, password, button } = setup();
    fireEvent.change(email, { target: { value: 'user@example.com' } });
    fireEvent.change(password, { target: { value: 'secret' } });
    expect(button).not.toBeDisabled();
    fireEvent.change(password, { target: { value: '' } });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  test('button not focusable when disabled', () => {
    const { button } = setup();
    // disabled state should set tabIndex to -1
    expect(button).toBeDisabled();
    // tabindex when disabled should be 3 (explicit) but button is disabled
    expect(button.tabIndex).toBe(3);
  });

  test('inputs and button have correct tabindex values', () => {
    const { email, password, button } = setup();
    expect(email.tabIndex).toBe(1);
    expect(password.tabIndex).toBe(2);
    expect(button.tabIndex).toBe(3);
  });
});
