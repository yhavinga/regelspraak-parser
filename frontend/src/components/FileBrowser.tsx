import { useState, useEffect } from 'react';
import { 
  FileIcon, 
  MagnifyingGlassIcon, 
  Cross2Icon,
  DownloadIcon,
  TrashIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import { fileService, RegelSpraakFile } from '../services/file-service';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface FileBrowserProps {
  onSelectFile: (file: RegelSpraakFile) => void;
  onClose: () => void;
}

export function FileBrowser({ onSelectFile, onClose }: FileBrowserProps) {
  const [files, setFiles] = useState<RegelSpraakFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  useEffect(() => {
    setFiles(fileService.getAllFiles());
  }, []);
  
  const filteredFiles = files.filter(file => {
    const matchesSearch = !searchTerm || 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || file.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });
  
  const allTags = Array.from(
    new Set(files.flatMap(f => f.tags || []))
  ).sort();
  
  const handleDelete = (file: RegelSpraakFile) => {
    if (confirm(`Weet je zeker dat je "${file.name}" wilt verwijderen?`)) {
      fileService.deleteFile(file.id);
      setFiles(fileService.getAllFiles());
    }
  };
  
  const handleExport = (file: RegelSpraakFile) => {
    fileService.exportFile(file);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Bestanden</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoek bestanden..."
              className="w-full pl-10 pr-3 py-2 border rounded-md"
            />
          </div>
          
          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  !selectedTag 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Alle
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedTag === tag 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* File list */}
        <div className="flex-1 overflow-auto p-4">
          {filteredFiles.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              {searchTerm || selectedTag 
                ? 'Geen bestanden gevonden' 
                : 'Nog geen bestanden opgeslagen'}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectFile(file)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <FileIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium">{file.name}</h3>
                        {file.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {file.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(file.modified, { 
                                addSuffix: true, 
                                locale: nl 
                              })}
                            </span>
                          </span>
                          {file.tags && file.tags.length > 0 && (
                            <div className="flex gap-1">
                              {file.tags.map(tag => (
                                <span 
                                  key={tag}
                                  className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(file);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Exporteer"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file);
                        }}
                        className="p-1 hover:bg-gray-200 rounded text-red-500"
                        title="Verwijder"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}