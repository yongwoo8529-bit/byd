
export enum SchoolGrade {
  LOW = '초등 저학년 (1-3학년)',
  MID = '초등 고학년 (4-6학년)',
  PRE_MIDDLE = '중학교 입학 준비 (예비 중1)'
}

export interface DreamData {
  keywords: string[];
  grade: SchoolGrade;
  hobbies: string;
  talents: string;
}

export interface Suggestion {
  careerName: string;
  description: string;
  focusArea: 'ACADEMIC' | 'PRACTICAL' | 'ARTISTIC' | 'SPORTS';
  actionPlan: string[];
  parentAdvice: string;
}
