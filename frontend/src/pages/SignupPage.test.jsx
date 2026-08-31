import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from './SignupPage';
import { AuthProvider } from '../context/AuthContext';
import * as authApi from '../api/authApi';

vi.mock('../api/authApi');

function renderSignupPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('SignupPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows validation errors for empty required fields', () => {
    renderSignupPage();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter your email.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a password.')).toBeInTheDocument();
  });

  it('rejects a password shorter than 8 characters', () => {
    renderSignupPage();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
  });

  it('signs up and logs the user in on success', async () => {
    authApi.signup.mockResolvedValue({ token: 'fake-token', user: { id: 1, name: 'Test User', email: 'test@example.com' } });

    renderSignupPage();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(authApi.signup).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    });
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' });
  });
});