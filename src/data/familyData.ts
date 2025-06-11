
export interface Person {
  id: string;
  name: string;
  birthDate: string;
  deathDate?: string;
  image?: string;
  relationship?: string;
  occupation?: string;
  location?: string;
  media?: MediaItem[];
  parents?: Person[];
  children?: Person[];
  spouse?: Person;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  description: string;
  date?: string;
}

export const familyData: { root: Person } = {
  root: {
    id: '1',
    name: 'Marie Dubois',
    birthDate: '15/03/1985',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    relationship: 'Moi',
    occupation: 'Ingénieure',
    location: 'Paris, France',
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
        description: 'Vacances en famille en Bretagne',
        date: '15/08/2023'
      }
    ],
    parents: [
      {
        id: '2',
        name: 'Jean Dubois',
        birthDate: '22/05/1955',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        relationship: 'Père',
        occupation: 'Médecin retraité',
        location: 'Lyon, France',
        media: [
          {
            id: 'm2',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
            description: 'Diplôme de médecine en 1980',
            date: '10/06/1980'
          }
        ],
        parents: [
          {
            id: '4',
            name: 'Henri Dubois',
            birthDate: '10/01/1930',
            deathDate: '25/12/2010',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            relationship: 'Grand-père paternel',
            occupation: 'Agriculteur',
            location: 'Normandie, France'
          },
          {
            id: '5',
            name: 'Suzanne Martin',
            birthDate: '18/07/1935',
            deathDate: '03/04/2015',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            relationship: 'Grand-mère paternelle',
            occupation: 'Institutrice',
            location: 'Normandie, France'
          }
        ]
      },
      {
        id: '3',
        name: 'Claire Moreau',
        birthDate: '08/09/1958',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        relationship: 'Mère',
        occupation: 'Professeure',
        location: 'Lyon, France',
        parents: [
          {
            id: '6',
            name: 'Paul Moreau',
            birthDate: '05/03/1932',
            deathDate: '15/08/2018',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
            relationship: 'Grand-père maternel',
            occupation: 'Charpentier',
            location: 'Bordeaux, France'
          },
          {
            id: '7',
            name: 'Yvette Leroy',
            birthDate: '20/11/1938',
            image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
            relationship: 'Grand-mère maternelle',
            occupation: 'Couturière',
            location: 'Bordeaux, France'
          }
        ]
      }
    ],
    children: [
      {
        id: '8',
        name: 'Lucas Dubois',
        birthDate: '12/04/2010',
        image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=150&h=150&fit=crop&crop=face',
        relationship: 'Fils',
        occupation: 'Collégien',
        location: 'Paris, France',
        media: [
          {
            id: 'm3',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
            description: 'Match de football',
            date: '20/05/2023'
          }
        ]
      },
      {
        id: '9',
        name: 'Emma Dubois',
        birthDate: '28/11/2013',
        image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=150&h=150&fit=crop&crop=face',
        relationship: 'Fille',
        occupation: 'Écolière',
        location: 'Paris, France'
      }
    ]
  }
};
