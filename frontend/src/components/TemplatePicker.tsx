import { fileTemplates, getTemplatesByCategory } from '../data/file-templates';
import { FileTemplate } from '../services/file-service';

interface TemplatePickerProps {
  onSelectTemplate: (template: FileTemplate) => void;
  onClose: () => void;
}

export function TemplatePicker({ onSelectTemplate, onClose }: TemplatePickerProps) {
  const templatesByCategory = getTemplatesByCategory();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Kies een template</h2>
          <p className="text-sm text-gray-600 mt-1">
            Begin met een voorbeeldtemplate en pas deze aan
          </p>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {Object.entries(templatesByCategory).map(([category, templates]) => (
            <div key={category} className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">{category}</h3>
              <div className="grid gap-3">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Annuleer
          </button>
        </div>
      </div>
    </div>
  );
}