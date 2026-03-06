import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
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
      <div className="admin-login__bg">
        <div className="admin-login__grid" />
        <div className="admin-login__glow" />
      </div>
      <div className="admin-login__box">
        <div className="admin-login__logo">
          <span>&lt;</span>dano<span className="gold">gomezdev</span><span> /&gt;</span>
        </div>
        <h1>Admin Panel</h1>
        <p>Iniciá sesión para gestionar tu portfolio</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" autoFocus />
          </div>
          <div className="form-group" style={{marginTop:16}}>
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-gold" disabled={loading} style={{width:'100%',justifyContent:'center',padding:'14px',marginTop:24}}>
            {loading ? 'Entrando...' : 'Ingresar →'}
          </button>
        </form>
      </div>
    </div>
  );
}
