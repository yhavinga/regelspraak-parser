export interface RegelSpraakFile {
  id: string;
  name: string;
  content: string;
  testData?: string;
  created: Date;
  modified: Date;
  tags?: string[];
  description?: string;
}

export interface FileTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  testData?: string;
}

export class FileService {
  private readonly STORAGE_KEY = 'regelspraak-files';
  private readonly RECENT_KEY = 'regelspraak-recent';
  private readonly MAX_RECENT = 10;
  
  // Get all saved files
  getAllFiles(): RegelSpraakFile[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const files = JSON.parse(stored);
      return files.map((f: any) => ({
        ...f,
        created: new Date(f.created),
        modified: new Date(f.modified)
      }));
    } catch {
      return [];
    }
  }
  
  // Save file
  saveFile(file: Omit<RegelSpraakFile, 'id' | 'created' | 'modified'>): RegelSpraakFile {
    const files = this.getAllFiles();
    const existing = files.find(f => f.name === file.name);
    
    if (existing) {
      // Update existing
      const updated = {
        ...existing,
        ...file,
        modified: new Date()
      };
      const newFiles = files.map(f => f.id === existing.id ? updated : f);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newFiles));
      this.addToRecent(updated.id);
      return updated;
    } else {
      // Create new
      const newFile: RegelSpraakFile = {
        ...file,
        id: `file-${Date.now()}`,
        created: new Date(),
        modified: new Date()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...files, newFile]));
      this.addToRecent(newFile.id);
      return newFile;
    }
  }
  
  // Delete file
  deleteFile(id: string): boolean {
    const files = this.getAllFiles();
    const filtered = files.filter(f => f.id !== id);
    if (filtered.length === files.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    this.removeFromRecent(id);
    return true;
  }
  
  // Get recent files
  getRecentFiles(): RegelSpraakFile[] {
    const recentIds = this.getRecentIds();
    const allFiles = this.getAllFiles();
    
    return recentIds
      .map(id => allFiles.find(f => f.id === id))
      .filter(Boolean) as RegelSpraakFile[];
  }
  
  // Export file
  exportFile(file: RegelSpraakFile, includeTestData = true): void {
    const exportData: any = {
      name: file.name,
      content: file.content,
      description: file.description,
      tags: file.tags,
      exported: new Date().toISOString()
    };
    
    if (includeTestData && file.testData) {
      exportData.testData = file.testData;
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.regelspraak.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Import file
  async importFile(fileInput: File): Promise<RegelSpraakFile> {
    const text = await fileInput.text();
    
    if (fileInput.name.endsWith('.json')) {
      // Import from JSON export
      const data = JSON.parse(text);
      return this.saveFile({
        name: data.name || fileInput.name.replace(/\.json$/, ''),
        content: data.content || '',
        testData: data.testData,
        description: data.description,
        tags: data.tags
      });
    } else {
      // Import as plain RegelSpraak
      const name = fileInput.name.replace(/\.(rs|regelspraak|txt)$/, '');
      return this.saveFile({
        name,
        content: text
      });
    }
  }
  
  // Private helpers
  private getRecentIds(): string[] {
    const stored = localStorage.getItem(this.RECENT_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  private addToRecent(id: string): void {
    const recent = this.getRecentIds().filter(rid => rid !== id);
    recent.unshift(id);
    localStorage.setItem(
      this.RECENT_KEY, 
      JSON.stringify(recent.slice(0, this.MAX_RECENT))
    );
  }
  
  private removeFromRecent(id: string): void {
    const recent = this.getRecentIds().filter(rid => rid !== id);
    localStorage.setItem(this.RECENT_KEY, JSON.stringify(recent));
  }
}

export const fileService = new FileService();