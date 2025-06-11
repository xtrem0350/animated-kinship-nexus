
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFamilyData } from '@/hooks/useFamilyData';
import { supabase } from '@/integrations/supabase/client';
import { User, Users, Search } from 'lucide-react';

interface FamilyRegistrationFormProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  onBack: () => void;
  onSuccess: () => void;
}

interface FamilyConnection {
  existingMemberId: string;
  relationshipType: string;
  memberName: string;
}

const FamilyRegistrationForm: React.FC<FamilyRegistrationFormProps> = ({
  email,
  password,
  firstName,
  lastName,
  onBack,
  onSuccess
}) => {
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<FamilyConnection | null>(null);
  const [relationshipType, setRelationshipType] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { members } = useFamilyData();
  const { toast } = useToast();

  const searchFamilyMembers = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom à rechercher",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      const results = members.filter(member => 
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun membre de famille trouvé avec ce nom",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const selectConnection = (member: any, relationship: string) => {
    setSelectedConnection({
      existingMemberId: member.id,
      relationshipType: relationship,
      memberName: `${member.first_name} ${member.last_name}`
    });
    setRelationshipType(relationship);
  };

  const calculateFamilyScore = () => {
    let score = 0;
    let reasons = [];

    // Vérifier les noms des parents
    if (fatherName.trim()) {
      const fatherMatch = members.find(member => 
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(fatherName.toLowerCase()) &&
        member.gender === 'masculin'
      );
      if (fatherMatch) {
        score += 30;
        reasons.push(`Père trouvé: ${fatherMatch.first_name} ${fatherMatch.last_name}`);
      }
    }

    if (motherName.trim()) {
      const motherMatch = members.find(member => 
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(motherName.toLowerCase()) &&
        member.gender === 'féminin'
      );
      if (motherMatch) {
        score += 30;
        reasons.push(`Mère trouvée: ${motherMatch.first_name} ${motherMatch.last_name}`);
      }
    }

    // Vérifier la connexion sélectionnée
    if (selectedConnection) {
      score += 40;
      reasons.push(`Connexion avec ${selectedConnection.memberName} (${selectedConnection.relationshipType})`);
    }

    return { score, reasons };
  };

  const submitFamilyRequest = async () => {
    if (!selectedConnection) {
      toast({
        title: "Connexion requise",
        description: "Vous devez sélectionner au moins un membre de famille existant",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { score, reasons } = calculateFamilyScore();
      
      // Créer le compte utilisateur d'abord
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
            name: `${firstName} ${lastName}`,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Créer une demande de validation familiale
        const requestData = {
          candidate_info: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            father_name: fatherName,
            mother_name: motherName
          },
          family_connection: selectedConnection,
          validation_score: score,
          validation_reasons: reasons
        };

        const { error: requestError } = await supabase
          .from('family_requests')
          .insert([{
            requester_id: authData.user.id,
            request_type: 'family_validation',
            target_member_id: selectedConnection.existingMemberId,
            request_data: requestData,
            status: score >= 50 ? 'approved' : 'pending'
          }]);

        if (requestError) throw requestError;

        if (score >= 50) {
          toast({
            title: "Inscription approuvée !",
            description: `Votre connexion familiale a été validée automatiquement (score: ${score}/100)`,
          });
        } else {
          toast({
            title: "Demande en attente",
            description: `Votre demande a été soumise pour validation (score: ${score}/100). Un administrateur l'examinera.`,
          });
        }

        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Validation de votre lien familial
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Pour rejoindre l'arbre familial, nous devons vérifier votre connexion avec la famille existante
        </p>
      </div>

      {/* Informations des parents */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Informations sur vos parents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du père
            </label>
            <Input
              type="text"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder="Prénom et nom du père"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la mère
            </label>
            <Input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Prénom et nom de la mère"
            />
          </div>
        </div>
      </div>

      {/* Recherche de connexion familiale */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Connexion avec un membre existant</h4>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un membre de famille..."
            className="flex-1"
          />
          <Button 
            onClick={searchFamilyMembers}
            disabled={searching}
            variant="outline"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <div className="border rounded-lg p-4 space-y-2">
            <h5 className="font-medium text-sm text-gray-700">Membres trouvés:</h5>
            {searchResults.map((member) => (
              <div key={member.id} className="border rounded p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {member.first_name} {member.last_name}
                  </span>
                  {member.birth_date && (
                    <span className="text-sm text-gray-500">
                      (né(e) en {new Date(member.birth_date).getFullYear()})
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['parent', 'enfant', 'frère/sœur', 'cousin(e)', 'oncle/tante', 'neveu/nièce'].map((relation) => (
                    <Button
                      key={relation}
                      onClick={() => selectConnection(member, relation)}
                      variant={selectedConnection?.existingMemberId === member.id && selectedConnection?.relationshipType === relation ? "default" : "outline"}
                      size="sm"
                    >
                      {relation}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connexion sélectionnée */}
        {selectedConnection && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Connexion sélectionnée:</strong> {selectedConnection.relationshipType} de {selectedConnection.memberName}
            </p>
          </div>
        )}
      </div>

      {/* Score de validation */}
      {(fatherName || motherName || selectedConnection) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Aperçu de la validation</h5>
          <div className="text-sm text-blue-800">
            {calculateFamilyScore().reasons.map((reason, index) => (
              <div key={index}>• {reason}</div>
            ))}
            <div className="mt-2 font-medium">
              Score total: {calculateFamilyScore().score}/100
              {calculateFamilyScore().score >= 50 ? ' ✅ Validation automatique' : ' ⏳ Validation manuelle requise'}
            </div>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex space-x-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Retour
        </Button>
        <Button 
          onClick={submitFamilyRequest} 
          disabled={loading || !selectedConnection}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Traitement...' : 'Soumettre la demande'}
        </Button>
      </div>
    </div>
  );
};

export default FamilyRegistrationForm;
