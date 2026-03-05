import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LOGO.png';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      toast.error('Credenciales incorrectas');
    } finally { setLoading(false); }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg" />
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__logo"><img src={logo} alt="KTL Kart"/></div>
          <h1>Panel Admin</h1>
          <p>Ingresá con tus credenciales</p>
        </div>
        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" autoFocus />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary admin-login__submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar →'}
          </button>
        </form>
        <div className="admin-login__back"><Link to="/">← Volver al sitio</Link></div>
      </div>
    </div>
  );
}
