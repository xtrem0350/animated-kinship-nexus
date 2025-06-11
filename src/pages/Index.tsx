
import React, { useState } from 'react';
import FamilyTree from '../components/FamilyTree';
import Timeline from '../components/Timeline';
import MediaGallery from '../components/MediaGallery';
import { useFamilyData, FamilyMember } from '../hooks/useFamilyData';
import { useAuth } from '../hooks/useAuth';
import { TreePine, Clock, Camera, Users, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const [viewMode, setViewMode] = useState<'tree' | 'timeline'>('tree');
  const [selectedPerson, setSelectedPerson] = useState<FamilyMember | null>(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const { user, signOut } = useAuth();
  const { members, familyTree, isLoading } = useFamilyData();

  const handlePersonSelect = (person: FamilyMember) => {
    setSelectedPerson(person);
  };

  const handleShowMedia = () => {
    if (selectedPerson) {
      setShowMediaGallery(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700">Chargement de l'arbre généalogique...</p>
        </div>
      </div>
    );
  }

  if (!familyTree && members.length === 0) {
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
                  <h1 className="text-3xl font-bold text-green-800">Familiale Tree</h1>
                  <p className="text-green-600">Commencez votre arbre généalogique</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Bienvenue, {user?.user_metadata?.name || user?.email}</span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Votre arbre généalogique est vide
            </h2>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre premier membre de famille pour créer votre arbre généalogique.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              Ajouter le premier membre
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Adapter les données pour l'ancien format si nécessaire
  const adaptedData = familyTree ? {
    root: {
      ...familyTree,
      name: `${familyTree.first_name} ${familyTree.last_name}`,
      birthDate: familyTree.birth_date || '',
      deathDate: familyTree.death_date || undefined,
      image: familyTree.profile_image_url || undefined,
      relationship: 'Racine',
      location: familyTree.current_location || undefined,
      occupation: familyTree.occupation || undefined,
    }
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* En-tête */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-3 rounded-full">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800">Familiale Tree</h1>
                <p className="text-green-600">Arbre généalogique familial ({members.length} membres)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Contrôles de vue */}
              <div className="flex items-center space-x-2 bg-green-50 rounded-full p-2">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300
                    ${viewMode === 'tree' 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'text-green-600 hover:bg-green-100'}
                  `}
                >
                  <TreePine className="w-5 h-5" />
                  <span>Arbre</span>
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300
                    ${viewMode === 'timeline' 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'text-green-600 hover:bg-green-100'}
                  `}
                >
                  <Clock className="w-5 h-5" />
                  <span>Chronologie</span>
                </button>
              </div>

              <span className="text-sm text-gray-600">Bienvenue, {user?.user_metadata?.name || user?.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Informations sur la personne sélectionnée */}
      {selectedPerson && (
        <div className="bg-white border-b border-green-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-green-400">
                  {selectedPerson.profile_image_url ? (
                    <img
                      src={selectedPerson.profile_image_url}
                      alt={`${selectedPerson.first_name} ${selectedPerson.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                      {selectedPerson.first_name[0]}{selectedPerson.last_name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedPerson.first_name} {selectedPerson.last_name}
                  </h3>
                  <p className="text-green-600">{selectedPerson.birth_date}</p>
                  {selectedPerson.occupation && (
                    <p className="text-gray-600 text-sm">{selectedPerson.occupation}</p>
                  )}
                </div>
              </div>
              
              {selectedPerson.media && selectedPerson.media.length > 0 && (
                <button
                  onClick={handleShowMedia}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <span>Voir les médias ({selectedPerson.media.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="pb-8">
        {adaptedData && viewMode === 'tree' ? (
          <FamilyTree 
            data={adaptedData} 
            onPersonSelect={(person) => {
              const member = members.find(m => m.id === person.id);
              if (member) handlePersonSelect(member);
            }}
          />
        ) : adaptedData && viewMode === 'timeline' ? (
          <Timeline data={adaptedData} />
        ) : null}
      </main>

      {/* Galerie de médias */}
      {showMediaGallery && selectedPerson && (
        <MediaGallery
          person={{
            ...selectedPerson,
            name: `${selectedPerson.first_name} ${selectedPerson.last_name}`,
            birthDate: selectedPerson.birth_date || '',
            media: selectedPerson.media || []
          }}
          onClose={() => setShowMediaGallery(false)}
        />
      )}

      {/* Pied de page */}
      <footer className="bg-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Users className="w-6 h-6" />
            <span className="text-xl font-semibold">Familiale Tree</span>
          </div>
          <p className="text-green-200">
            Préservez et partagez l'histoire de votre famille avec style
          </p>
          <div className="mt-4 text-sm text-green-300">
            © 2024 Familiale Tree - Créé avec ❤️ pour préserver vos souvenirs familiaux
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
