
import React, { useState } from 'react';
import { SchoolGrade, DreamData, Suggestion } from './types';
import { getCareerCounseling } from './geminiService';
import { 
  Sparkles, 
  Rocket, 
  BookOpen, 
  Activity, 
  Palette, 
  User, 
  ChevronRight,
  RefreshCw,
  Heart,
  Target
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DreamData>({
    keywords: [],
    grade: '' as unknown as SchoolGrade,
    hobbies: '',
    talents: ''
  });
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const isLowGrade = data.grade === SchoolGrade.LOW;

  const addKeyword = () => {
    if (currentKeyword.trim() && !data.keywords.includes(currentKeyword.trim())) {
      setData({ ...data, keywords: [...data.keywords, currentKeyword.trim()] });
      setCurrentKeyword('');
    }
  };

  const handleStartAnalysis = async () => {
    if (!data.grade || data.keywords.length < 2) {
      alert("학년을 선택하고 단어를 최소 2개 이상 적어주세요!");
      return;
    }
    setLoading(true);
    try {
      const result = await getCareerCounseling(data);
      setSuggestion(result);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("AI 친구가 생각 중이에요. 잠시 후 다시 시도해 주세요!");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSuggestion(null);
    setData({
      keywords: [],
      grade: '' as unknown as SchoolGrade,
      hobbies: '',
      talents: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-600 flex items-center justify-center gap-2 drop-shadow-sm">
          <Rocket className="text-orange-400" size={40} /> 드림 내비게이터
        </h1>
        <p className="text-gray-600 mt-2 font-medium">우리 아이의 진심을 찾는 AI 진로 상담소</p>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-blue-50">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 text-xl font-bold text-gray-800 border-b pb-4">
              <User className="text-blue-500" /> 안녕! 너에 대해 알려줘
            </div>
            
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-bold ml-1">지금 몇 학년이야?</span>
                <select 
                  className="mt-2 block w-full rounded-2xl border-2 border-gray-100 p-4 bg-gray-50 focus:border-blue-400 focus:outline-none text-black font-semibold transition-all"
                  value={data.grade}
                  onChange={(e) => setData({...data, grade: e.target.value as SchoolGrade})}
                >
                  <option value="" disabled>여기 눌러서 선택해봐!</option>
                  {Object.values(SchoolGrade).map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-gray-700 font-bold ml-1">평소에 뭐하고 놀 때가 제일 즐거워?</span>
                <input 
                  type="text" 
                  className="mt-2 block w-full rounded-2xl border-2 border-gray-100 p-4 bg-gray-50 focus:border-blue-400 focus:outline-none text-black font-semibold placeholder:text-gray-300"
                  placeholder="예: 그림 그리기, 동생이랑 놀기, 축구"
                  value={data.hobbies}
                  onChange={(e) => setData({...data, hobbies: e.target.value})}
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-bold ml-1">남들이 모르는 너만의 재주가 있니?</span>
                <input 
                  type="text" 
                  className="mt-2 block w-full rounded-2xl border-2 border-gray-100 p-4 bg-gray-50 focus:border-blue-400 focus:outline-none text-black font-semibold placeholder:text-gray-300"
                  placeholder="예: 곤충 이름 다 알기, 블록 빨리 조립하기"
                  value={data.talents}
                  onChange={(e) => setData({...data, talents: e.target.value})}
                />
              </label>
            </div>

            <button 
              onClick={() => data.grade ? setStep(2) : alert("학년을 선택해줘!")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
              다음으로 넘어가기 <ChevronRight />
            </button>
          </div>
        )}

        {/* Step 2: Keywords */}
        {step === 2 && (
          <div className="p-8 space-y-6 animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-3 text-xl font-bold text-gray-800 border-b pb-4">
              <Sparkles className="text-yellow-500" /> 생각나는 단어를 마구 적어봐!
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-xl font-medium">
                💡 머릿속에 갑자기 떠오르는 단어들을 여러 개 적어주면 AI가 너의 꿈 지도를 더 잘 그려줄 수 있어.
              </p>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 rounded-2xl border-2 border-gray-100 p-4 bg-gray-50 focus:border-yellow-400 focus:outline-none text-black font-semibold"
                  placeholder="예: 우주, 고양이, 빵, 경찰..."
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <button 
                  onClick={addKeyword}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 rounded-2xl font-bold shadow-md active:scale-95 transition-all"
                >
                  추가
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[140px] p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                {data.keywords.length === 0 && (
                  <div className="w-full flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Target size={32} className="opacity-30" />
                    <span className="italic">단어를 2개 이상 추가해줘!</span>
                  </div>
                )}
                {data.keywords.map((kw, idx) => (
                  <span 
                    key={idx} 
                    className="bg-white border-2 border-blue-100 px-5 py-2 rounded-full text-blue-600 font-bold flex items-center gap-2 shadow-sm animate-in zoom-in"
                  >
                    #{kw}
                    <button 
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      onClick={() => setData({...data, keywords: data.keywords.filter((_, i) => i !== idx)})}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-5 rounded-2xl transition-all"
              >
                뒤로가기
              </button>
              <button 
                onClick={handleStartAnalysis}
                disabled={loading || data.keywords.length < 2}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100 active:scale-95"
              >
                {loading ? <RefreshCw className="animate-spin" /> : "내 꿈 분석하기 ✨"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && suggestion && (
          <div className="p-8 space-y-8 animate-in zoom-in duration-700">
            <div className="text-center space-y-4">
              <div className="inline-block p-6 bg-gradient-to-br from-blue-50 to-white rounded-full shadow-inner mb-2 border-4 border-white">
                {suggestion.focusArea === 'ACADEMIC' && <BookOpen size={56} className="text-blue-500" />}
                {suggestion.focusArea === 'SPORTS' && <Activity size={56} className="text-red-500" />}
                {suggestion.focusArea === 'ARTISTIC' && <Palette size={56} className="text-pink-500" />}
                {suggestion.focusArea === 'PRACTICAL' && <Sparkles size={56} className="text-yellow-500" />}
              </div>
              <div>
                <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-2 inline-block">
                  AI가 찾은 미래의 너
                </span>
                <h2 className="text-4xl font-black text-blue-900 mt-2">{suggestion.careerName}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg font-medium px-4">
                "{suggestion.description}"
              </p>
            </div>

            <div className="bg-orange-50 p-8 rounded-[2rem] border-2 border-orange-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Rocket size={80} />
              </div>
              <h3 className="text-xl font-bold text-orange-700 flex items-center gap-2 mb-6">
                <Target /> 지금부터 중1까지의 꿈 패턴
              </h3>
              <ul className="space-y-4 relative">
                {suggestion.actionPlan.map((plan, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-gray-800">
                    <span className="bg-orange-400 text-white font-black rounded-xl w-8 h-8 flex items-center justify-center flex-shrink-0 shadow-md">
                      {idx + 1}
                    </span>
                    <p className="font-semibold leading-tight pt-1">{plan}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border-4 border-blue-50">
              <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2 mb-4">
                <Heart className="fill-blue-100" /> 부모님을 위한 드림 가이드
              </h3>
              <p className="text-gray-600 leading-relaxed italic font-medium">
                {suggestion.parentAdvice}
              </p>
            </div>

            <div className="space-y-4">
                <div className="text-center py-5 px-6 bg-gray-50 rounded-2xl text-gray-500 text-sm font-medium border border-gray-100">
                  <p>📍 알림: 아이들의 꿈은 자라면서 계속 변할 수 있어요.</p>
                  <p className="mt-1">초3 때, 그리고 초6 때 다시 한번 방문해서 꿈의 변화를 기록해보세요!</p>
                </div>
                <button 
                  onClick={reset}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-95"
                >
                  새로운 단어로 다시 해보기
                </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-8 text-center text-gray-400 text-xs max-w-lg leading-relaxed">
        드림 내비게이터는 아이가 스스로를 발견하도록 돕는 인공지능 도구입니다.<br/>
        부모님의 따뜻한 격려가 아이의 가장 큰 원동력이 됩니다.
      </footer>
    </div>
  );
}
