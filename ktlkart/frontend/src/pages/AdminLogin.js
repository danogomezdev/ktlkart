import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminLogin.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__logo">KTL<span>KART</span></div>
          <h2>Panel Admin</h2>
          <p>Ingresá con tus credenciales</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="form-group">
            <label>Usuario</label>
            <input value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value}))} placeholder="admin" required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', marginTop:'8px'}} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="admin-login__hint">Usuario: <code>admin</code> / Pass: <code>ktlkart2024</code></p>
      </div>
    </div>
  );
}
