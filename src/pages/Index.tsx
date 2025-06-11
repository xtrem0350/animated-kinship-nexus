
import React, { useState } from 'react';
import FamilyTree from '../components/FamilyTree';
import Timeline from '../components/Timeline';
import MediaGallery from '../components/MediaGallery';
import { familyData } from '../data/familyData';
import { Person } from '../data/familyData';
import { TreePine, Clock, Camera, Users } from 'lucide-react';

const Index: React.FC = () => {
  const [viewMode, setViewMode] = useState<'tree' | 'timeline'>('tree');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleShowMedia = () => {
    if (selectedPerson) {
      setShowMediaGallery(true);
    }
  };

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
                <p className="text-green-600">Arbre généalogique de la famille Dubois</p>
              </div>
            </div>
            
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
                  {selectedPerson.image ? (
                    <img
                      src={selectedPerson.image}
                      alt={selectedPerson.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                      {selectedPerson.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedPerson.name}</h3>
                  <p className="text-green-600">{selectedPerson.relationship}</p>
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
        {viewMode === 'tree' ? (
          <FamilyTree 
            data={familyData} 
            onPersonSelect={handlePersonSelect}
          />
        ) : (
          <Timeline data={familyData} />
        )}
      </main>

      {/* Galerie de médias */}
      {showMediaGallery && selectedPerson && (
        <MediaGallery
          person={selectedPerson}
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
