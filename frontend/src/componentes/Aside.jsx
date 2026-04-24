import { useState, useEffect } from 'react';
import axios from 'axios';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Aside({ setUser, user, estaOffline, visits }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
        axios.defaults.withCredentials = true;
        setEmail('');
        setPassword('');

        return () => {
            setEmail('');
            setPassword('');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Iniciamos sesión en Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // 2. Avisamos al backend para que inicie la sesión de Express
            await axios.post('http://localhost:8000/api/usuarios/login', { 
                email: userCredential.user.email 
            });
            
            // 3. Obtenemos los datos del usuario desde MongoDB
            const res = await axios.get('http://localhost:8000/api/usuarios/me');
            setUser(res.data);
            localStorage.setItem('hadSession', '1');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);
            alert('Error en login: Credenciales incorrectas o problema de red');
            setPassword('');
        }
    };

    const cerrarSesion = async () => {
        try {
            // 1. Cerramos sesión en Firebase
            await signOut(auth);
            
            // 2. Cerramos sesión en el Backend
            await axios.post('http://localhost:8000/api/usuarios/logout');
            
            setUser(null);
            localStorage.removeItem('hadSession');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);
            alert('Error en logout');
        }   
    };  

    const renderizarAside = () => {
        if (!user) {
            return (
                <div className="mt-4 card shadow-sm p-3 aside-panel" style={{ maxWidth: "600px" }}>
                    <h3 className="mb-3">Inicio de sesión</h3>
                    <form className="aside-login-form" onSubmit={handleSubmit} autoComplete="off">
                        <div className="campo-flotante">
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " disabled={estaOffline} required />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="campo-flotante">
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " autoComplete="new-password" disabled={estaOffline} required />
                            <label htmlFor="password">Contraseña</label>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={estaOffline}>Autenticarse</button>
                    </form>
                </div>
            );
        }
        return (
            <div className="mt-4 card shadow-sm p-3 aside-panel" style={{ maxWidth: "600px" }}>
                <h3>Bienvenido, {user.nombre}</h3>
                <div className="aside-user-info">
                    {user.role === 'admin' && (
                        <div>Rol: {user.role}</div>
                    )}
                    {/* Aquí mostramos las visitas de la sesión de Express recibidas por props */}
                    <div>Visitas de sesión: {visits}</div>
                </div>
                <button className="btn btn-primary" onClick={cerrarSesion} disabled={estaOffline}>Cerrar sesión</button>
            </div>
        );
    };

    return (
        renderizarAside()
    );
}

export default Aside;