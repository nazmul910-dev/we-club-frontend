export interface IQuizAttemptAnswer {
  question: string;
  selectedOptionIndexes?: number[];
  booleanAnswer?: boolean;
  isCorrect: boolean;
}

// Backend Response
export interface IQuizAttempt {
  _id: string;
  user: string;
  module: string;

  attemptNumber: number;

  answers: IQuizAttemptAnswer[];

  totalQuestions: number;
  correctAnswers: number;

  score: number;
  passed: boolean;

  submittedAt: string;

  createdAt?: string;
  updatedAt?: string;
}

// Submit payload
export interface ISubmitQuizAnswer {
  questionId: string;
  selectedOptionIndexes?: number[];
  booleanAnswer?: boolean;
}

export interface ISubmitQuizAttempt {
  answers: ISubmitQuizAnswer[];
}

export interface IQuizAttemptAdminQuery {
  userId?: string;
  moduleId?: string;
  passed?: boolean;
  page?: number;
  limit?: number;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IQuizAttemptListResponse {
  meta: IPaginationMeta;
  data: IQuizAttempt[];
}