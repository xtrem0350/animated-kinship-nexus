
import React, { useState } from 'react';
import { Person } from '../data/familyData';
import { Calendar, MapPin, Briefcase, Camera } from 'lucide-react';

interface PersonNodeProps {
  person: Person;
  isCenter?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const PersonNode: React.FC<PersonNodeProps> = ({ 
  person, 
  isCenter = false, 
  size = 'medium',
  onClick 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const containerSizes = {
    small: 'w-32',
    medium: 'w-40',
    large: 'w-56'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div 
      className={`
        ${containerSizes[size]} relative cursor-pointer transform transition-all duration-300 
        hover:scale-105 animate-fade-in
        ${isCenter ? 'scale-110 z-10' : ''}
      `}
      onClick={onClick}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Carte principale */}
      <div className={`
        bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4
        border-2 ${isCenter ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-green-200'}
      `}>
        {/* Avatar */}
        <div className={`
          ${sizeClasses[size]} mx-auto mb-3 rounded-full overflow-hidden 
          border-4 ${isCenter ? 'border-green-400' : 'border-gray-200'} 
          bg-gradient-to-br from-green-400 to-green-600
        `}>
          {person.image && !imageError ? (
            <img
              src={person.image}
              alt={person.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              {getInitials(person.name)}
            </div>
          )}
        </div>

        {/* Nom */}
        <h3 className={`
          text-center font-semibold text-gray-800 
          ${size === 'large' ? 'text-lg' : size === 'medium' ? 'text-base' : 'text-sm'}
          leading-tight
        `}>
          {person.name}
        </h3>

        {/* Relation */}
        {person.relationship && (
          <p className="text-center text-green-600 text-xs font-medium mt-1">
            {person.relationship}
          </p>
        )}

        {/* Indicateur de médias */}
        {person.media && person.media.length > 0 && (
          <div className="absolute top-2 right-2">
            <Camera className="w-4 h-4 text-green-600" />
          </div>
        )}

        {/* Indicateur de décès */}
        {person.deathDate && (
          <div className="absolute top-2 left-2">
            <span className="text-gray-400 text-xs">†</span>
          </div>
        )}
      </div>

      {/* Détails au survol */}
      {showDetails && (
        <div className="absolute z-20 top-full left-1/2 transform -translate-x-1/2 mt-2 
                      bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 
                      animate-scale-in">
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {person.birthDate}
                {person.deathDate && ` - ${person.deathDate}`}
              </span>
            </div>
            
            {person.occupation && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{person.occupation}</span>
              </div>
            )}
            
            {person.location && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{person.location}</span>
              </div>
            )}

            {person.media && person.media.length > 0 && (
              <div className="border-t pt-2">
                <p className="text-green-600 font-medium text-xs">
                  {person.media.length} média(s) disponible(s)
                </p>
              </div>
            )}
          </div>
          
          {/* Triangle pointer */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonNode;
