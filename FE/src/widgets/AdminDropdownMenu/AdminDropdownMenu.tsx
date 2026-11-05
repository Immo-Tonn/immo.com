import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@shared/lib/localeRouter';
import axios from '@features/utils/axiosConfig';
import styles from './AdminDropdownMenu.module.css';

interface AdminDropdownMenuProps {
  onLogout: () => void;
}

const AdminDropdownMenu: React.FC<AdminDropdownMenuProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteAdmin = async (): Promise<void> => {
    const confirmPassword = window.prompt(
      'Um das Löschen zu bestätigen, geben Sie Ihr Passwort ein:',
    );

    if (!confirmPassword) {
      return;
    }

    try {
      const token = sessionStorage.getItem('adminToken');

      await axios.delete('/auth/delete-admin', {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: confirmPassword },
      });

      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      alert('Adminregistrierung entfernt');
      navigate('/add-property');
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          'Fehler beim Löschen der Registrierung',
      );
    } finally {
      setIsMenuOpen(false);
    }
  };

  const handleChangePassword = () => {
    setIsMenuOpen(false);
    navigate('/change-password');
  };

  const handleCreateObject = () => {
    setIsMenuOpen(false);
    navigate('/create-object');
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  return (
    <div className={styles.adminDropdown} ref={menuRef}>
      <button
        className={styles.adminButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Admin
      </button>

      {isMenuOpen && (
        <div className={styles.adminDropdownContent}>
          <button
            className={styles.adminDropdownItem}
            onClick={handleChangePassword}
          >
            Passwort ändern
          </button>

          <button
            className={styles.adminDropdownItem}
            onClick={handleCreateObject}
          >
            Objekt erstellen
          </button>

          <button
            className={styles.adminDropdownItem}
            onClick={handleDeleteAdmin}
          >
            Registrierung löschen
          </button>
          <button className={styles.adminDropdownItem} onClick={handleLogout}>
            Ausloggen
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDropdownMenu;
