import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginForm from '../LoginForm';

test('renders login form with email and password inputs', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
