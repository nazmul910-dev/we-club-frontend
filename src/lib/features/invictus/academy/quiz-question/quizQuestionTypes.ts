export const QUIZ_QUESTION_TYPES = [
  "single_choice",
  "multiple_choice",
  "true_false",
] as const;
export type QuizQuestionType = (typeof QUIZ_QUESTION_TYPES)[number];

export const QUIZ_QUESTION_STATUSES = ["draft", "published", "archived"] as const;
export type QuizQuestionStatus = (typeof QUIZ_QUESTION_STATUSES)[number];

export interface IPillarRef {
  _id: string;
  name?: string;
  slug?: string;
  title?: string;
  status?: string;
}

export interface IModuleRef {
  _id: string;
  title: string;
  slug?: string;
  moduleNumber?: number;
  status?: string;
  pillar?: IPillarRef;
}

// Backend Response
export interface IQuizQuestion {
  _id: string;
  module: IModuleRef;

  question: string;
  questionType: QuizQuestionType;

  options?: string[];
  correctOptionIndexes?: number[];
  correctBooleanAnswer?: boolean;

  explanation?: string;

  order: number;

  status: QuizQuestionStatus;

  publishedAt?: string;
  archivedAt?: string;

  createdAt?: string;
  updatedAt?: string;
}

// Create Payload
export interface ICreateQuizQuestion {
  question: string;
  questionType: QuizQuestionType;

  options?: string[];
  correctOptionIndexes?: number[];
  correctBooleanAnswer?: boolean;

  explanation?: string;
  order: number;
}

// Update Payload
export interface IUpdateQuizQuestion {
  question?: string;
  questionType?: QuizQuestionType;

  options?: string[] | null;
  correctOptionIndexes?: number[] | null;
  correctBooleanAnswer?: boolean | null;

  explanation?: string | null;
  order?: number;
}