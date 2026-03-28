import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté au chargement
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Appel optionnel au backend pour vérifier le token
          // const res = await api.get('/auth/me');
          // setUser(res.data);
          
          // Simulation pour ton développement (à remplacer par l'appel API)
          const savedUser = JSON.parse(localStorage.getItem('user'));
          setUser(savedUser);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    // Ici, tu appelleras ton backend : const res = await api.post('/auth/login', { email, password });
    // Pour l'instant, on simule une réussite pour tes tests :
    const mockUser = { 
      id: 1, 
      email, 
      role: 'ADMIN', // Change ici pour tester (TECHNICIEN, COMMERCIAL, etc.)
      name: 'Equipe Elevendevs' 
    };
    
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};