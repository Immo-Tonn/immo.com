// immo/FE7src/pages/Auth/ForgotPassword.tsx
import { useState } from 'react';
import { Link } from '@shared/lib/localeRouter';
import axios from '@features/utils/axiosConfig';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Password Reset Handler
  const handleResetPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email');
      return;
    }

    // Checking email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      console.log('Submitting a password reset request:', { email });
      const response = await axios.post('/auth/reset-password', { email });
      console.log('Server response:', response.data);
      const responseData = response.data as {
        message: string;
        tempPassword?: string;
      };
      let displayMessage = responseData.message;

      // In development mode, show the temporary password, if there is one
      if (responseData.tempPassword) {
        displayMessage += ` (Temporary password: ${responseData.tempPassword})`;
      }

      setMessage(displayMessage);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Password reset error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Passwort-Wiederherstellung</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}
      {message && (
        <div style={{ color: 'green', marginBottom: '15px' }}>{message}</div>
      )}

      <form onSubmit={handleResetPassword}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 15px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Отправка...' : 'Passwort zurücksetzen'}
        </button>

        <div style={{ marginTop: '20px' }}>
          <Link to="/add-property" style={{ color: '#2196F3' }}>
            Zurück zum Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
