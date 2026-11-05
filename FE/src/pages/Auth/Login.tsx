// immo/FE/src/pages/Auth/Login.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@shared/lib/localeRouter';
import axios from '@features/utils/axiosConfig';
import {
  dispatchLoginEvent,
  dispatchLogoutEvent,
  isAuthenticated,
  setupAutoLogout,
} from '@features/utils/authEvent'; // Импортируем функцию отправки события

const Login: React.FC = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [adminExists, setAdminExists] = useState<boolean>(false); // false по умолчанию
  const [loadingCheck, setLoadingCheck] = useState<boolean>(true); // Добавлено для отслеживание загрузки проверки
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // Администратор в системе ?
  useEffect(() => {
    // Настройка автоматического выхода
    setupAutoLogout();

    const checkAdminExists = async (): Promise<void> => {
      try {
        setLoadingCheck(true);
        const response = await axios.get('/auth/admin-exists');
        const exists = (response.data as { adminExists: boolean }).adminExists;
        setAdminExists(exists);
        console.log('Администратор существует:', exists);
      } catch (error) {
        console.error('Ошибка при проверке админа:', error);
      } finally {
        setLoadingCheck(false);
      }
    };

    checkAdminExists();
  }, []);

  // Обработчик входа
  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!login || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post('/auth/add-property', {
        login,
        password,
      });

      const responseData = response.data as {
        _id: string;
        email: string;
        fullName: string;
        username: string;
        token: string;
      };

      // Сохраняем токен и данные пользователя
      sessionStorage.setItem('adminToken', responseData.token);
      sessionStorage.setItem('adminInfo', JSON.stringify(responseData));

      // Отправляем событие об успешной авторизации
      dispatchLoginEvent();

      // Перенаправляем на страницу объектов
      navigate('/immobilien');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик удаления регистрации админа
  const handleDeleteAdmin = async (): Promise<void> => {
    // Запрашиваем подтверждение пароля
    const confirmPassword = window.prompt(
      'Um das Löschen zu bestätigen, geben Sie Ihr Passwort ein:',
    );

    if (!confirmPassword) {
      return; // Отмена ввода или оставил поле пустым
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem('adminToken');

      // Здесь вы можете добавить дополнительную проверку пароля на сервере,
      // но для этого нужно создать дополнительный эндпоинт

      await axios.delete('/auth/delete-admin', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Очищаем данные авторизации
      dispatchLogoutEvent();
      //  sessionStorage.removeItem('adminToken');
      //  sessionStorage.removeItem('adminInfo');

      setAdminExists(false);
      alert('Adminregistrierung entfernt');
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Fehler beim Löschen der Registrierung',
      );
    } finally {
      setLoading(false);
    }
  };

  // Проверка авторизации админа
  const isAdminAuthenticated = isAuthenticated();
  // const isAuthenticated = !!sessionStorage.getItem('adminToken');

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Admin Panel</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="login"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Login (E-Mail oder Benutzername):
          </label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLogin(e.target.value)
            }
            style={{ width: '95%', padding: '8px' }}
          />
        </div>

        <div style={{ width: '95%', marginBottom: '15px' }}>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Password:
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              // type="password"
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              style={{
                width: '100%',
                padding: '8px',
                borderColor: 'grey',
                borderWidth: '0.5px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                flex: '1',
                height: '47px',
                fontSize: '20px',
                // padding: '0 10px',
                marginTop: '-13px',
                border: '1px solid #ccc',
                borderLeft: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: 'fit-content',
            padding: '10px 15px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Login...' : 'anmelden'}
        </button>
      </form>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/forgot-password" style={{ color: '#2196F3' }}>
          Passwort vergessen
        </Link>

        {!loadingCheck && !adminExists && (
          <Link to="/register" style={{ color: '#2196F3' }}>
            Registrierung
          </Link>
        )}
      </div>

      {isAdminAuthenticated && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '36px' }}>
          <Link
            to="/change-password"
            style={{
              marginTop: '20px',
              padding: '10px 5px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              textDecoration: 'none',
              textAlign: 'center',
              flex: '1',
            }}
          >
            Kennwort ändern
          </Link>

          <button
            onClick={handleDeleteAdmin}
            style={{
              marginTop: '20px',
              padding: '10px 15px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            Registrierung löschen
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
