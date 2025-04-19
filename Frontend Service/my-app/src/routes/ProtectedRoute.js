import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isModeratorAuthenticated = localStorage.getItem('moderatorToken') !== null;
  
  if (!isModeratorAuthenticated) {
    return <Navigate to="/moderator/login" replace />;
  }

  return children;
};