
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import FamilyRequestsAdmin from '@/components/FamilyRequestsAdmin';
import { Button } from '@/components/ui/button';
import { LogOut, Users } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, signOut } = useAuth();

  // TODO: Ajouter une vérification du rôle admin
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-3 rounded-full">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800">Administration Familiale Tree</h1>
                <p className="text-green-600">Gestion des demandes de validation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.user_metadata?.name || user?.email}
              </span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <FamilyRequestsAdmin />
      </main>
    </div>
  );
};

export default Admin;
