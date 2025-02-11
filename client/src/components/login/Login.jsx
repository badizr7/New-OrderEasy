import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authServices';
import './styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      setUser(data.usuario);
      setMessage('¡Inicio de sesión exitoso!');
      navigate('/dashboard/inicio');
    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || 'Error en el inicio de sesión.';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="login-container">
            <div className="login-logo">
              <h1>InvControl</h1>
            </div>
            <h2 className="login-title">Iniciar Sesión</h2>
            {message && (
              <div className={`message ${message.includes('exitoso') ? 'message-success' : 'message-error'}`}>
                {message}
              </div>
            )}
            <form className="form-container" onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="username" className="input-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="correo@empresa.com"
                />
              </div>
              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="submit-button">
                Ingresar
              </button>
            </form>
            <div className="register-link">
              <button className="register-button">
                Registrarse
              </button>
            </div>
    </div>
  );
}

export default Login;