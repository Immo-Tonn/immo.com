// src/pages/Auth/ChangePassword.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@shared/lib/localeRouter';
import axios from '@features/utils/axiosConfig';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const navigate = useNavigate();

  // Checking authorization when component loading
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      navigate('/add-property');
    }
  }, [navigate]);

  // Password validation
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

        if (!/\d/.test(password)) {
          return "The password must contain at least one number.";
        }

        if (!/[A-Z]/.test(password)) {
          return "The password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
          return "he password must contain at least one lowercase letter.";
        }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return 'The password must contain at least one special character.';
    }

    return null;
  };

  // Password change handler
  const handleChangePassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Resett previous messages
    setError('');
    setSuccess('');

    // Checking that all fields are filled in
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Checking password matches
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    // Checking that the new password is different from the current one
    if (newPassword === currentPassword) {
      setError('The new password must be different from the current one.');
      return;
    }

    // Checking password complexity
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);

      // get a token from
      const token = sessionStorage.getItem('adminToken');

      // send a request to change the password
      await axios.put(
        '/auth/change-password',
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSuccess('Password successfully changed');

      // Clearing form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // After 2 seconds redirect in 2 seconds to the main page
      setTimeout(() => {
        navigate('/immobilien');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при смене пароля');
    } finally {
      setLoading(false);
    }
  };

  // Индикатор сложности пароля
  const getPasswordStrength = (
    password: string,
  ): {
    text: string;
    color: string;
    width: string;
  } => {
    if (!password) {
      return { text: '', color: '#e0e0e0', width: '0%' };
    }

    const criteria = [
      password.length >= 8,
      /\d/.test(password),
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    ];

    const metCriteria = criteria.filter(c => c).length;

      switch (metCriteria) {
        case 0:
        case 1:
          return { text: "Very weak password", color: "#f44336", width: "20%" };
        case 2:
          return { text: "Weak password", color: "#ff9800", width: "40%" };
        case 3:
          return { text: "Medium password", color: "#ffeb3b", width: "60%" };
        case 4:
          return { text: "Satisfactory password", color: "#8bc34a", width: "80%" };
        case 5:
          return { text: "Strong password", color: "#4caf50", width: "100%" };
        default:
          return { text: "", color: "#e0e0e0", width: "0%" };
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Passwortänderung</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}

      {success && (
        <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>
      )}

      <form onSubmit={handleChangePassword}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="currentPassword"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Aktuelles Passwort:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              // type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{
                flex: '1',
                height: '46px',
                fontSize: '20px',
                // padding: '0 10px',
                marginTop: '-12px',
                border: '1px solid #ccc',
                borderLeft: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            >
              {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="newPassword"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Neues Passwort:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              // type="password"
              id="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                flex: '1',
                height: '46px',
                fontSize: '20px',
                // padding: '0 10px',
                marginTop: '-12px',
                border: '1px solid #ccc',
                borderLeft: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            >
              {showNewPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {newPassword && (
            <div style={{ marginTop: '5px' }}>
              <div
                style={{
                  height: '5px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: passwordStrength.width,
                    backgroundColor: passwordStrength.color,
                    transition: 'width 0.3s ease',
                  }}
                ></div>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  marginTop: '3px',
                  color: passwordStrength.color,
                }}
              >
                {passwordStrength.text}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              marginBottom: '5px',
              // position: "relative",
            }}
          >
            Passwortbestätigung:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              // type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                flex: '1',
                height: '46px',
                fontSize: '20px',
                // padding: '0 10px',
                marginTop: '-12px',
                border: '1px solid #ccc',
                borderLeft: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '3px' }}>
              Die Passwörter stimmen nicht überein
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              margin: '0',
              padding: '10px 15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              flex: '1',
            }}
          >
            {loading ? 'Saving...' : 'Change password'}
          </button>

          <Link
            to="/immobilien"
            style={{
              padding: '10px 15px',
              background: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              textDecoration: 'none',
              textAlign: 'center',
              flex: '1',
            }}
          >
            Abbrechen
          </Link>
        </div>
      </form>

      <div style={{ marginTop: "20px", fontSize: "14px" }}>
        <h3>Kennwortanforderungen:</h3>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Mindestens 8 Zeichen</li>
          <li>Mindestens 1 Ziffer</li>
          <li>Mindestens 1 Großbuchstabe</li>
          <li>Mindestens 1 Kleinbuchstabe</li>
          <li>Mindestens 1 Sonderzeichen (!@#$%^&*()_+...)</li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePassword;
