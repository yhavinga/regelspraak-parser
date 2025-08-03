import { useMemo, useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';

interface ASTExplorerProps {
  model: any | null;
}

interface TreeNodeProps {
  label: string;
  value?: any;
  children?: Record<string, any>;
  defaultExpanded?: boolean;
}

function TreeNode({ label, value, children, defaultExpanded = false }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = children && Object.keys(children).length > 0;
  
  return (
    <div className="select-none">
      <div 
        className="flex items-center py-1 hover:bg-gray-100 cursor-pointer"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <span className="w-4">
          {hasChildren && (
            isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />
          )}
        </span>
        <span className="font-mono text-sm">
          <span className="text-blue-600">{label}</span>
          {value !== undefined && (
            <>
              <span className="text-gray-500">: </span>
              <span className="text-green-600">
                {typeof value === 'string' ? `"${value}"` : String(value)}
              </span>
            </>
          )}
        </span>
      </div>
      {isExpanded && children && (
        <div className="ml-4 border-l border-gray-200">
          {Object.entries(children).map(([key, val]) => (
            <div key={key} className="ml-2">
              {typeof val === 'object' && val !== null ? (
                <TreeNode label={key} children={val} />
              ) : (
                <TreeNode label={key} value={val} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ASTExplorer({ model }: ASTExplorerProps) {
  const astTree = useMemo(() => {
    if (!model) return null;
    
    // Debug: log what we receive
    console.log('AST Explorer received model:', model);
    
    // Convert Maps to objects for display
    const tree: any = {};
    
    if (model.objectTypes) {
      tree.objectTypes = {};
      model.objectTypes.forEach((value: any, key: string) => {
        tree.objectTypes[key] = value;
      });
    }
    
    if (model.parameters) {
      tree.parameters = {};
      model.parameters.forEach((value: any, key: string) => {
        tree.parameters[key] = value;
      });
    }
    
    if (model.rules && model.rules.length > 0) {
      tree.rules = {};
      model.rules.forEach((rule: any, index: number) => {
        tree.rules[rule.name || `Rule ${index}`] = rule;
      });
    }
    
    if (model.domains) {
      tree.domains = {};
      model.domains.forEach((value: any, key: string) => {
        tree.domains[key] = value;
      });
    }
    
    if (model.unitSystems && model.unitSystems.length > 0) {
      tree.unitSystems = model.unitSystems;
    }
    
    return tree;
  }, [model]);
  
  if (!model) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        <div>No valid AST available</div>
        <div className="mt-2 text-xs">
          Debug: model = {JSON.stringify(model, null, 2)}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-2 overflow-auto h-full">
      <h3 className="font-semibold mb-2">Abstract Syntax Tree</h3>
      <TreeNode label="DomainModel" children={astTree} defaultExpanded />
    </div>
  );
}