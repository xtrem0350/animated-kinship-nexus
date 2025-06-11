
import React, { useState } from 'react';
import { Person, MediaItem } from '../data/familyData';
import { X, Calendar, User } from 'lucide-react';

interface MediaGalleryProps {
  person: Person;
  onClose: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ person, onClose }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  if (!person.media || person.media.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Aucun média</h3>
            <p className="text-gray-600 mb-6">
              Aucun média disponible pour {person.name}
            </p>
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="bg-green-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-400 flex items-center justify-center text-white font-bold">
                  {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{person.name}</h3>
              <p className="text-green-100">{person.media.length} média(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Grille de médias */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {person.media.map((media) => (
              <div
                key={media.id}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedMedia(media)}
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Voir en grand</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="font-medium text-gray-800 mb-2">{media.description}</p>
                  {media.date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(media.date.split('/').reverse().join('-')).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal pour afficher le média sélectionné */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="max-w-4xl w-full max-h-full relative">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {selectedMedia.type === 'image' ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.description}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full h-full object-contain rounded-lg"
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
              <p className="font-medium">{selectedMedia.description}</p>
              {selectedMedia.date && (
                <p className="text-sm text-gray-300 mt-1">
                  {new Date(selectedMedia.date.split('/').reverse().join('-')).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
