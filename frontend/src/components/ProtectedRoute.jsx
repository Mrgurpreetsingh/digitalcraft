import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();


  console.log('=== PROTECTED ROUTE DEBUG ===');
  console.log('Loading:', loading);
  console.log('IsAuthenticated:', isAuthenticated);
  console.log('User:', user);
  console.log('User role:', user?.role);
  console.log('User role (type):', typeof user?.role);
  console.log('User role (length):', user?.role?.length);
  console.log('User role (JSON):', JSON.stringify(user?.role));
  console.log('Allowed roles:', allowedRoles);
  console.log('Includes?', allowedRoles.includes(user?.role));
  console.log('LocalStorage user:', localStorage.getItem('user'));
  console.log('============================');


  // Attendre la vérification de l'authentification
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Chargement...</div>
      </div>
    );
  }


  // Vérifier l'authentification
  if (!isAuthenticated || !user) {
    console.log('❌ Redirection vers /connexion - Non authentifié');
    return <Navigate to="/connexion" replace />;
  }


  // Vérifier les rôles autorisés
  if (!allowedRoles.includes(user.role)) {
    console.log('❌ Redirection vers / - Rôle non autorisé');
    return <Navigate to="/" replace />;
  }


  console.log('✅ Accès autorisé');
  return children;
};


export default ProtectedRoute;


