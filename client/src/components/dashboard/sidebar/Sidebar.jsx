import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, LineChart, DollarSign, LogOut } from 'lucide-react';
import './styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo">
          <Package className="logo-icon" />
          <span className="logo-text">OrderEasy</span>
        </div>
      </div>

      <div className="menu-container">
        <nav className="menu-items">
          <h3 className="menu-title">Menú Principal</h3>

          <Link to="inicio" className="menu-item">
            <LayoutDashboard className="menu-icon" />
            <span>Inicio</span>
          </Link>   

          <Link to="inventario" className="menu-item">
            <Package className="menu-icon" />
            <span>Inventario</span>
          </Link>
          
          <Link to="balance" className="menu-item">
            <DollarSign className="menu-icon" />
            <span>Balance</span>
          </Link>

          <Link to="estadisticas" className="menu-item">
            <LineChart className="menu-icon" />
            <span>Estadísticas</span>
          </Link>
        </nav>
      </div>

      <div className="logout-container">
        <Link 
          to="/" 
          className="logout-button"
          onClick={() => localStorage.removeItem('token')}
        >
          <LogOut className="menu-icon" />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;