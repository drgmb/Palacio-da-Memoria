export interface RoomData {
  roomName: string;
  narrative: string;
  technicalInfo: string[];
  imagePrompt: string;
  generatedImageBase64?: string | null;
  isGeneratingImage?: boolean;
}

export interface PalaceGenerationRequest {
  theme: string;
  content: string;
  visualStyle: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING', // Generating text structure
  VISUALIZING = 'VISUALIZING', // Generating images
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
