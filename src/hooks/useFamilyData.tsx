
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  death_date: string | null;
  birth_place: string | null;
  current_location: string | null;
  occupation: string | null;
  phone_number: string | null;
  email: string | null;
  bio: string | null;
  profile_image_url: string | null;
  gender: string | null;
  verified: boolean;
  parents?: FamilyMember[];
  children?: FamilyMember[];
  media?: FamilyMedia[];
}

export interface FamilyMedia {
  id: string;
  media_type: 'photo' | 'video' | 'document';
  media_url: string;
  title: string | null;
  description: string | null;
  date_taken: string | null;
  location: string | null;
  type: 'image' | 'video';
  url: string;
}

export interface FamilyRelationship {
  id: string;
  person_id: string;
  related_person_id: string;
  relationship_type: string;
}

export const useFamilyData = () => {
  const { user } = useAuth();

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ['family-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: relationships = [], isLoading: loadingRelationships } = useQuery({
    queryKey: ['family-relationships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_relationships')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: media = [], isLoading: loadingMedia } = useQuery({
    queryKey: ['family-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      // Transformer les données pour la compatibilité
      return data.map(item => ({
        ...item,
        type: item.media_type === 'photo' ? 'image' as const : 'video' as const,
        url: item.media_url
      }));
    },
  });

  // Construire l'arbre généalogique à partir des données
  const buildFamilyTree = () => {
    if (!members.length || !relationships.length) return null;

    const membersMap = new Map(members.map(m => [m.id, { ...m, parents: [], children: [], media: [] }]));
    
    // Ajouter les médias à chaque membre
    media.forEach(m => {
      if (m.family_member_id && membersMap.has(m.family_member_id)) {
        membersMap.get(m.family_member_id)!.media!.push(m);
      }
    });

    // Construire les relations parent-enfant
    relationships.forEach(rel => {
      const person = membersMap.get(rel.person_id);
      const relatedPerson = membersMap.get(rel.related_person_id);
      
      if (person && relatedPerson) {
        if (rel.relationship_type === 'parent') {
          person.parents!.push(relatedPerson);
        } else if (rel.relationship_type === 'enfant') {
          person.children!.push(relatedPerson);
        }
      }
    });

    // Retourner le premier membre comme racine (peut être amélioré)
    return Array.from(membersMap.values())[0] || null;
  };

  const addFamilyMember = async (memberData: Partial<FamilyMember>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    // S'assurer que first_name et last_name sont présents
    if (!memberData.first_name || !memberData.last_name) {
      throw new Error('Le prénom et le nom sont requis');
    }

    // Nettoyer les données pour la base de données
    const cleanedData = {
      first_name: memberData.first_name,
      last_name: memberData.last_name,
      birth_date: memberData.birth_date || null,
      death_date: memberData.death_date || null,
      birth_place: memberData.birth_place || null,
      current_location: memberData.current_location || null,
      occupation: memberData.occupation || null,
      phone_number: memberData.phone_number || null,
      email: memberData.email || null,
      bio: memberData.bio || null,
      profile_image_url: memberData.profile_image_url || null,
      gender: memberData.gender || null,
      added_by: user.id,
    };

    const { data, error } = await supabase
      .from('family_members')
      .insert([cleanedData])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const addRelationship = async (personId: string, relatedPersonId: string, relationshipType: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('family_relationships')
      .insert([{
        person_id: personId,
        related_person_id: relatedPersonId,
        relationship_type: relationshipType,
        added_by: user.id,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const familyTree = buildFamilyTree();

  return {
    members,
    relationships,
    media,
    familyTree,
    isLoading: loadingMembers || loadingRelationships || loadingMedia,
    addFamilyMember,
    addRelationship,
  };
};
