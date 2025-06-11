
import React, { useState } from 'react';
import PersonNode from './PersonNode';
import { Person } from '../data/familyData';

interface FamilyTreeProps {
  data: { root: Person };
  onPersonSelect?: (person: Person) => void;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ data, onPersonSelect }) => {
  const [centerNode, setCenterNode] = useState<Person>(data.root);

  const handleNodeClick = (person: Person) => {
    setCenterNode(person);
    onPersonSelect?.(person);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="flex flex-col items-center space-y-12 relative">
        
        {/* Grands-parents */}
        {centerNode.parents && centerNode.parents.some(parent => parent.parents) && (
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <h3 className="text-green-700 font-semibold mb-4">Grands-parents paternels</h3>
              <div className="flex space-x-4">
                {centerNode.parents[0]?.parents?.map((grandparent) => (
                  <PersonNode
                    key={grandparent.id}
                    person={grandparent}
                    onClick={() => handleNodeClick(grandparent)}
                    size="small"
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-green-700 font-semibold mb-4">Grands-parents maternels</h3>
              <div className="flex space-x-4">
                {centerNode.parents[1]?.parents?.map((grandparent) => (
                  <PersonNode
                    key={grandparent.id}
                    person={grandparent}
                    onClick={() => handleNodeClick(grandparent)}
                    size="small"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ligne de connexion verticale */}
        {centerNode.parents && centerNode.parents.some(parent => parent.parents) && (
          <div className="w-0.5 h-8 bg-gradient-to-b from-green-300 to-green-500"></div>
        )}

        {/* Parents */}
        {centerNode.parents && (
          <div className="text-center">
            <h3 className="text-green-700 font-semibold mb-4">Parents</h3>
            <div className="flex justify-center space-x-6">
              {centerNode.parents.map((parent) => (
                <PersonNode
                  key={parent.id}
                  person={parent}
                  onClick={() => handleNodeClick(parent)}
                  size="medium"
                />
              ))}
            </div>
          </div>
        )}

        {/* Ligne de connexion */}
        {centerNode.parents && (
          <div className="w-0.5 h-8 bg-gradient-to-b from-green-300 to-green-500"></div>
        )}

        {/* Personne centrale */}
        <div className="text-center">
          <PersonNode
            person={centerNode}
            onClick={() => handleNodeClick(centerNode)}
            isCenter
            size="large"
          />
        </div>

        {/* Ligne de connexion vers enfants */}
        {centerNode.children && centerNode.children.length > 0 && (
          <div className="w-0.5 h-8 bg-gradient-to-b from-green-500 to-green-300"></div>
        )}

        {/* Enfants */}
        {centerNode.children && centerNode.children.length > 0 && (
          <div className="text-center">
            <h3 className="text-green-700 font-semibold mb-4">Enfants</h3>
            <div className="flex justify-center space-x-6 flex-wrap">
              {centerNode.children.map((child) => (
                <PersonNode
                  key={child.id}
                  person={child}
                  onClick={() => handleNodeClick(child)}
                  size="medium"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTree;
