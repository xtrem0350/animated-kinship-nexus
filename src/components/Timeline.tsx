
import React from 'react';
import { Person } from '../data/familyData';
import { Calendar, Camera, User } from 'lucide-react';

interface TimelineProps {
  data: { root: Person };
}

interface TimelineEvent {
  type: 'birth' | 'death' | 'media';
  person: Person;
  date: Date;
  description: string;
  media?: any;
}

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const flattenTree = (node: Person, events: TimelineEvent[] = []): TimelineEvent[] => {
    // Ajouter l'événement de naissance
    events.push({
      type: 'birth',
      person: node,
      date: new Date(node.birthDate.split('/').reverse().join('-')),
      description: `Naissance de ${node.name}`
    });

    // Ajouter l'événement de décès si existe
    if (node.deathDate) {
      events.push({
        type: 'death',
        person: node,
        date: new Date(node.deathDate.split('/').reverse().join('-')),
        description: `Décès de ${node.name}`
      });
    }

    // Ajouter les médias comme événements
    if (node.media) {
      node.media.forEach(media => {
        if (media.date) {
          events.push({
            type: 'media',
            person: node,
            date: new Date(media.date.split('/').reverse().join('-')),
            description: media.description,
            media: media
          });
        }
      });
    }

    // Parcourir les parents et enfants
    if (node.parents) {
      node.parents.forEach(parent => {
        flattenTree(parent, events);
      });
    }

    if (node.children) {
      node.children.forEach(child => {
        flattenTree(child, events);
      });
    }

    return events;
  };

  const events = flattenTree(data.root).sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birth':
        return <User className="w-5 h-5 text-green-600" />;
      case 'death':
        return <Calendar className="w-5 h-5 text-gray-500" />;
      case 'media':
        return <Camera className="w-5 h-5 text-blue-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'birth':
        return 'border-green-400 bg-green-50';
      case 'death':
        return 'border-gray-400 bg-gray-50';
      case 'media':
        return 'border-blue-400 bg-blue-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-8">
          Chronologie Familiale
        </h2>
        
        <div className="relative">
          {/* Ligne temporelle */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-300 to-green-500"></div>
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <div 
                key={index} 
                className="relative flex items-start space-x-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Point sur la timeline */}
                <div className={`
                  w-16 h-16 rounded-full border-4 ${getEventColor(event.type)}
                  flex items-center justify-center shadow-lg z-10
                `}>
                  {getEventIcon(event.type)}
                </div>
                
                {/* Contenu de l'événement */}
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {event.description}
                      </h3>
                      <p className="text-green-600 font-medium mb-3">
                        {event.date.toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      
                      {/* Informations sur la personne */}
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                          {event.person.image ? (
                            <img
                              src={event.person.image}
                              alt={event.person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                              {event.person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{event.person.name}</p>
                          {event.person.relationship && (
                            <p className="text-sm text-gray-600">{event.person.relationship}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Média si disponible */}
                    {event.media && (
                      <div className="ml-4">
                        {event.media.type === 'image' ? (
                          <img
                            src={event.media.url}
                            alt={event.media.description}
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                          />
                        ) : (
                          <video
                            src={event.media.url}
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                            muted
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
