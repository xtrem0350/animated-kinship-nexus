
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, User, Users } from 'lucide-react';

interface FamilyRequest {
  id: string;
  request_type: string;
  status: string;
  request_data: any;
  created_at: string;
  requester_id: string;
  target_member_id: string;
  review_comment?: string;
}

const FamilyRequestsAdmin: React.FC = () => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['family-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FamilyRequest[];
    },
  });

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject', comment?: string) => {
    setProcessingId(requestId);
    
    try {
      const { error } = await supabase
        .from('family_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          review_comment: comment || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Si approuvé, créer le membre de famille et les relations
      if (action === 'approve') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const candidateInfo = request.request_data.candidate_info;
          
          // Créer le membre de famille
          const { data: newMember, error: memberError } = await supabase
            .from('family_members')
            .insert([{
              first_name: candidateInfo.first_name,
              last_name: candidateInfo.last_name,
              email: candidateInfo.email,
              added_by: request.requester_id,
              verified: true
            }])
            .select()
            .single();

          if (memberError) throw memberError;

          // Créer la relation familiale
          const connection = request.request_data.family_connection;
          if (connection && newMember) {
            const { error: relationError } = await supabase
              .from('family_relationships')
              .insert([{
                person_id: newMember.id,
                related_person_id: connection.existingMemberId,
                relationship_type: connection.relationshipType,
                added_by: request.requester_id
              }]);

            if (relationError) throw relationError;
          }

          // Mettre à jour le profil utilisateur
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              family_member_id: newMember.id,
              can_add_members: true
            })
            .eq('id', request.requester_id);

          if (profileError) throw profileError;
        }
      }

      queryClient.invalidateQueries({ queryKey: ['family-requests'] });
      
      toast({
        title: action === 'approve' ? "Demande approuvée" : "Demande rejetée",
        description: action === 'approve' 
          ? "L'utilisateur a été ajouté à l'arbre familial" 
          : "La demande a été rejetée",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Demandes de validation familiale</h2>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune demande de validation en attente
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const candidateInfo = request.request_data?.candidate_info;
            const connection = request.request_data?.family_connection;
            const score = request.request_data?.validation_score || 0;
            const reasons = request.request_data?.validation_reasons || [];

            return (
              <div
                key={request.id}
                className={`border rounded-lg p-6 ${getStatusColor(request.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      {getStatusIcon(request.status)}
                      <h3 className="text-lg font-semibold">
                        {candidateInfo?.first_name} {candidateInfo?.last_name}
                      </h3>
                      <span className="text-sm opacity-75">
                        ({candidateInfo?.email})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Informations des parents:</h4>
                        <p className="text-sm">
                          Père: {candidateInfo?.father_name || 'Non renseigné'}
                        </p>
                        <p className="text-sm">
                          Mère: {candidateInfo?.mother_name || 'Non renseigné'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Connexion familiale:</h4>
                        <p className="text-sm">
                          {connection?.relationshipType} de {connection?.memberName}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Score de validation: {score}/100</h4>
                      <div className="space-y-1">
                        {reasons.map((reason: string, index: number) => (
                          <p key={index} className="text-sm">• {reason}</p>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm opacity-75">
                      Demande soumise le {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </p>

                    {request.review_comment && (
                      <div className="mt-3 p-3 bg-white bg-opacity-50 rounded">
                        <p className="text-sm">
                          <strong>Commentaire:</strong> {request.review_comment}
                        </p>
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleRequestAction(request.id, 'approve')}
                        disabled={processingId === request.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        onClick={() => handleRequestAction(request.id, 'reject')}
                        disabled={processingId === request.id}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FamilyRequestsAdmin;
