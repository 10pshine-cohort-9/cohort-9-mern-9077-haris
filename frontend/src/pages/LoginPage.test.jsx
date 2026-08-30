import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import * as authApi from '../api/authApi';

vi.mock('../api/authApi');

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows validation errors when submitting an empty form', () => {
    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByText('Please enter your email.')).toBeInTheDocument();
    expect(screen.getByText('Please enter your password.')).toBeInTheDocument();
  });

  it('shows an error for an invalid email format', () => {
    renderLoginPage();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('logs in and stores the token on successful submit', async () => {
    authApi.login.mockResolvedValue({ token: 'fake-token', user: { id: 1, name: 'Test User', email: 'test@example.com' } });

    renderLoginPage();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('shows the server error message when login fails', async () => {
    authApi.login.mockRejectedValue({ response: { data: { message: 'Invalid email or password' } } });

    renderLoginPage();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});