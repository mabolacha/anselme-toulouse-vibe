import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminUpload from '@/components/AdminUpload';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-gold font-montserrat">Vérification des permissions...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gold font-montserrat mb-4">
            Accès refusé
          </h1>
          <p className="text-muted-foreground font-montserrat">
            Vous n'avez pas les permissions d'administrateur.
          </p>
        </div>
      </div>
    );
  }

  return <AdminUpload />;
};

export default Admin;