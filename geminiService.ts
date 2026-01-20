
import { GoogleGenAI, Type } from "@google/genai";
import { DreamData, Suggestion } from "./types";

// 현재 환경의 API_KEY를 사용하여 AI 인스턴스 초기화
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCareerCounseling(data: DreamData): Promise<Suggestion> {
  const prompt = `
    당신은 세계 최고의 아동 심리 및 진로 상담 전문가입니다. 
    아이(초등학생)가 입력한 키워드와 취미, 특기를 바탕으로 미래 경로를 설계해주세요.

    [상담 대상 정보]
    - 현재 학년: ${data.grade}
    - 관심 키워드: ${data.keywords.join(', ')}
    - 하고 싶은 일/취미: ${data.hobbies}
    - 좋아하는 것/특기: ${data.talents}

    [필수 분석 로직]
    1. 직업 성격 구분:
       - '학술형(ACADEMIC)': 의사, 교수, 연구원 등. 국영수 위주의 '공부'가 필수임을 명시하고 학습 계획 위주로 짭니다.
       - '운동/실기형(SPORTS/PRACTICAL)': 운동선수, 요리사, 댄서 등. 재능이 우선이며 '공부'보다는 해당 분야에 '올인'하는 훈련을 강조합니다. 억지로 학원에 보내지 말라는 조언을 포함하세요.
       - '창의형(ARTISTIC)': 예술가, 크리에이터 등. 영감과 경험을 강조합니다.
    
    2. 발달 단계별 가이드:
       - 1~3학년: 흥미 위주, "무엇이든 될 수 있다"는 용기.
       - 4~6학년: 조금 더 구체적인 준비 과정.
       - 예비 중1: 중학교 입학 후 바로 실천 가능한 주간/월간 패턴 제안.

    3. 부모님 조언: 
       - 아이가 진심으로 하고 싶은 것을 방해하는 '불필요한 학원'을 거르도록 조언하세요.
       - 아이의 재능에 맞는 '특화된 환경'을 만들어주는 법을 설명하세요.

    결과는 반드시 지정된 JSON 형식으로 응답하세요.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', 
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          careerName: { type: Type.STRING, description: "추천 직업 명칭" },
          description: { type: Type.STRING, description: "아이의 눈높이에 맞춘 다정한 설명" },
          focusArea: { 
            type: Type.STRING, 
            enum: ['ACADEMIC', 'PRACTICAL', 'ARTISTIC', 'SPORTS'],
            description: "집중 분야 분류"
          },
          actionPlan: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "중1까지의 구체적 로드맵 (3~5단계)" 
          },
          parentAdvice: { type: Type.STRING, description: "부모님을 위한 솔직하고 구체적인 교육 가이드" }
        },
        required: ['careerName', 'description', 'focusArea', 'actionPlan', 'parentAdvice']
      }
    }
  });

  return JSON.parse(response.text);
}
