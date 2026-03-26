export interface Topic {
  title: string;
  completed: boolean;
}

export interface RoadmapData {
  frontend: Topic[];
  backend: Topic[];
}

export interface Question {
  type: 'mcq' | 'debug' | 'challenge';
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  realWorldUseCase: string;
}

export interface TeachData {
  explanation: string;
  codeSnippets: {
    frontend: string;
    backend: string;
  };
  miniProject: string;
  commonMistakes: string[];
  exercises: string[];
}

export interface ProgressData {
  completedTopics: string[];
  scores: {
    topic: string;
    score: number;
    total: number;
    difficulty: string;
    date: string;
  }[];
  totalAttempted: number;
  accuracy: number;
}
