import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { Boxes } from 'lucide-react';
import '../login/styles/Login.css';

function Registro() {
  const navigate = useNavigate(); // Inicializar useNavigate
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    console.log('Datos del formulario:', formData);
    setMessage('Registro exitoso');
  };

  return (
    <div className="screen-container">
      <div className="login-wrapper">
        {/* Left side - Image Section (60%) */}
        <div className="image-section">
          <div className="image-overlay" />
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Inventory Management"
            className="background-image"
          />
          <div className="image-content">
            <h2>Sistema de Gestión de Inventarios</h2>
            <p>
              Gestiona tu inventario con precisión y lleva la productividad de tu negocio más allá con soluciones tecnológicas innovadoras.
            </p>
          </div>
        </div>

        {/* Right side - Registration Form (40%) */}
        <div className="form-section">
          <div className="form-container">
            <div className="header">
              <div className="logo">
                <Boxes className="icon" />
              </div>
              <h1>OrderEasy</h1>
              <h2>Registro de Usuario</h2>
            </div>

            {message && (
              <div className={`message ${message.includes('exitoso') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='nombres'>
                <div className="input-group">
                    <label htmlFor="primerNombre">
                    Primer Nombre
                    </label>
                    <input
                    type="text"
                    id="primerNombre"
                    name="primerNombre"
                    value={formData.primerNombre}
                    onChange={handleChange}
                    placeholder="Juan"
                    required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="segundoNombre">
                    Segundo Nombre
                    </label>
                    <input
                    type="text"
                    id="segundoNombre"
                    name="segundoNombre"
                    value={formData.segundoNombre}
                    onChange={handleChange}
                    placeholder="Antonio"
                    />
                </div>
              </div>

              <div className="apellidos">
                <div className="input-group">
                    <label htmlFor="primerApellido">
                    Primer Apellido
                    </label>
                    <input
                    type="text"
                    id="primerApellido"
                    name="primerApellido"
                    value={formData.primerApellido}
                    onChange={handleChange}
                    placeholder="Pérez"
                    required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="segundoApellido">
                    Segundo Apellido
                    </label>
                    <input
                    type="text"
                    id="segundoApellido"
                    name="segundoApellido"
                    value={formData.segundoApellido}
                    onChange={handleChange}
                    placeholder="García"
                    />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="correo">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@empresa.com"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="telefono">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Registrarse
              </button>
            </form>

            <div className="register">
            <button 
                className="register-button"
                onClick={() => navigate('/login')}
              >
                Volver al Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;