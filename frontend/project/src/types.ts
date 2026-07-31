export type PersonalityMode = 'fast-track' | 'deep-mastery' | 'practical-only';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type SubtopicStatus = 'pending' | 'completed';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Subtopic {
  subtopic_id: string;
  title: string;
  status: SubtopicStatus;
}

export interface Topic {
  topic_id: string;
  title: string;
  progress: number;
  subtopics: Subtopic[];
}

export interface LearningPath {
  learning_path_id: string;
  title: string;
  progress: number;
  topics: Topic[];
}

export interface CompleteResponse {
  subtopic_id: string;
  status: SubtopicStatus;
  subtopic_quiz_id: string | null;
  topic_quiz_id: string | null;
}

export interface QuizQuestion {
  question_id: string;
  question: string;
  options: { a: string; b: string; c: string; d: string };
}

export interface Quiz {
  quiz_id: string;
  questions: QuizQuestion[];
}

export interface QuizSubmitResponse {
  score: number;
  total: number;
  correct_answers: Record<string, 'a' | 'b' | 'c' | 'd'>;
}

export interface QuizResultEntry {
  quiz_id: string;
  type: string;
  topic_id: string | null;
  subtopic_id: string | null;
  score: number;
  total: number;
  percentage: number;
}

export interface QuizHistoryResponse {
  message: string;
  results: QuizResultEntry[];
}
