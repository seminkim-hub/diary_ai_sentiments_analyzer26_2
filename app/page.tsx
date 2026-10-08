"use client";

import { useState } from "react";

const moods = [
  { id: "happy", emoji: "🥰", title: "행복 · 뿌듯함", subtitle: "기쁨과 감사", color: "gold" },
  { id: "calm", emoji: "🌿", title: "평온 · 안", subtitle: "고요함과 평화", color: "mint" },
  { id: "excited", emoji: "✨", title: "설렘 · 기대", subtitle: "활력과 설렘", color: "rose" },
  { id: "tired", emoji: "☕", title: "피로 · 지침", subtitle: "쉼이 필요한 마음", color: "blue" },
  { id: "anxious", emoji: "🌧️", title: "불안 · 고민", subtitle: "걱정과 긴장", color: "slate" },
];

type Analysis = {
  emotion: string;
  title: string;
  summary: string;
  scores: { emotion: string; score: number }[];
  letter: string;
  question: string;
};

type DiaryEntry = { timestamp: string; datetime: string; content: string };

function formatDiaryDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "2-digit", minute: "2-digit" }).format(parsed);
}

export default function Home() {
  const [diary, setDiary] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [entryDateTime, setEntryDateTime] = useState("");
  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(null);
  const [showDiaries, setShowDiaries] = useState(false);
  const [savedDiaries, setSavedDiaries] = useState<DiaryEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingDiaries, setLoadingDiaries] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [storageMessage, setStorageMessage] = useState("");
  const now = new Date();
  const date = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(now);
  const currentEntryDateTime = entryDateTime ? new Date(entryDateTime) : now;
  const entryDate = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(currentEntryDateTime);
  const entryTime = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit" }).format(currentEntryDateTime);

  async function analyze() {
    if (!diary.trim()) { setError("오늘의 마음을 먼저 적어 주세요."); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ diary }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "분석 중 문제가 생겼어요.");
      setAnalysis(data);
    } catch (e) { setError(e instanceof Error ? e.message : "분석에 실패했어요. 잠시 후 다시 시도해 주세요."); }
    finally { setLoading(false); }
  }

  async function loadDiaries() {
    setLoadingDiaries(true);
    setStorageError("");
    try {
      const response = await fetch("/api/diaries?action=list", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "저장된 일기를 불러오지 못했습니다.");
      setSavedDiaries(result.data);
    } catch (e) {
      setStorageError(e instanceof Error ? e.message : "저장된 일기를 불러오지 못했습니다.");
    } finally {
      setLoadingDiaries(false);
    }
  }

  async function saveDiary() {
    const content = diary.trim();
    if (!content) { setStorageError("저장할 일기를 먼저 작성해 주세요."); return; }
    setSaving(true);
    setStorageError("");
    setStorageMessage("");
    const datetime = entryDateTime || new Date().toISOString();
    const payload = selectedTimestamp
      ? { action: "update", timestamp: selectedTimestamp, data: { datetime, content } }
      : { action: "create", data: { datetime, content } };
    try {
      const response = await fetch("/api/diaries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "일기를 시트에 저장하지 못했습니다.");
      setStorageMessage(selectedTimestamp ? "일기를 수정했습니다." : "일기를 저장했습니다.");
      setSelectedTimestamp(null);
      setEntryDateTime(result.data.datetime || datetime);
      if (showDiaries) await loadDiaries();
    } catch (e) {
      setStorageError(e instanceof Error ? e.message : "일기를 시트에 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleDiaryList() {
    const shouldOpen = !showDiaries;
    setShowDiaries(shouldOpen);
    if (shouldOpen) await loadDiaries();
  }

  function editDiary(entry: DiaryEntry) {
    setDiary(entry.content);
    setEntryDateTime(entry.datetime);
    setSelectedTimestamp(entry.timestamp);
    setAnalysis(null);
    setStorageError("");
    setStorageMessage("");
    setShowDiaries(false);
  }

  async function deleteDiary(entry: DiaryEntry) {
    if (!window.confirm("이 일기를 구글 시트에서 삭제할까요?")) return;
    setStorageError("");
    try {
      const response = await fetch("/api/diaries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", timestamp: entry.timestamp }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "일기를 삭제하지 못했습니다.");
      setSavedDiaries((current) => current.filter((item) => item.timestamp !== entry.timestamp));
      setStorageMessage("일기를 삭제했습니다.");
      if (selectedTimestamp === entry.timestamp) restart();
    } catch (e) {
      setStorageError(e instanceof Error ? e.message : "일기를 삭제하지 못했습니다.");
    }
  }

  function restart() {
    setDiary(""); setAnalysis(null); setError(""); setEntryDateTime("");
    setSelectedTimestamp(null); setStorageError(""); setStorageMessage("");
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="마인드글로우 홈"><span className="brand-mark">✦</span><span><b>마인드글로우</b><small>마음을 비추는 AI</small></span></a>
        <div className="today-chip">▣　오늘, {date}</div>
      </header>

      <section className="intro" id="top">
        <div><span className="connected">마음을 돌보는 AI 감성 일기</span><h1>마인드글로우 <em>(MindGlow)</em></h1><p>AI 일기 감성 분석</p></div>
        <div className="date-control"><b>{date}</b></div>
      </section>

      <section className="composer card">
        <div className="section-title"><span className="counter">{diary.length} / 1,000자</span></div>
        <div className="diary-input-wrap"><div className="diary-input-actions"><button className="save-button" type="button" onClick={saveDiary} disabled={saving}>{saving ? "저장 중…" : selectedTimestamp ? "수정 저장" : "저장"}</button><button className="diary-view-button" type="button" onClick={toggleDiaryList} aria-expanded={showDiaries}>{showDiaries ? "닫기" : "일기보기"}</button></div><textarea aria-label="일기 작성 영역" maxLength={1000} value={diary} onChange={(e) => { setDiary(e.target.value); setAnalysis(null); setEntryDateTime((current) => current || new Date().toISOString()); if (error) setError(""); if (storageError) setStorageError(""); }} placeholder="오늘 하루는 어땠나요? 편안한 마음으로 지금 떠오르는 생각과 감정을 적어 보세요…" /></div>
        <div className="entry-meta"><small><i/> 작성 시각　{entryDate} · {entryTime}</small></div>
        {storageError && <p className="error-message" role="alert">{storageError}</p>}
        {storageMessage && <p className="storage-message" role="status">{storageMessage}</p>}
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="composer-actions"><button className="soft-button" onClick={restart}>↻　재시작</button><button className="primary-button" onClick={analyze} disabled={loading}>{loading ? <><span className="spinner"/> 마음을 살펴보는 중…</> : <>✦　AI 분석 (gemini-3.1-flash-lite)　→</>}</button></div>
      </section>

      {showDiaries && <section className="diary-list card" aria-live="polite">
        <div className="diary-list-heading"><h2>저장된 일기</h2><span>{savedDiaries.length}개</span></div>
        {loadingDiaries ? <p className="diary-list-empty">구글 시트에서 일기를 불러오는 중입니다…</p> : savedDiaries.length === 0 ? <p className="diary-list-empty">저장된 일기가 없습니다.</p> : <div className="diary-list-items">{savedDiaries.map((entry) => <article className="diary-list-item" key={entry.timestamp}><time>{formatDiaryDateTime(entry.datetime)}</time><p>{entry.content}</p><div><button type="button" onClick={() => editDiary(entry)}>수정</button><button type="button" className="delete-diary" onClick={() => deleteDiary(entry)}>삭제</button></div></article>)}</div>}
      </section>}

      {analysis && <section className="moods-section">
        <div className="section-heading"><h2>♧ 오늘의 감성 이모지</h2><span>Gemini 분석에 따라 대표 감정이 강조됩니다</span></div>
        <div className="mood-grid">{moods.map((mood) => <article key={mood.id} className={`mood-card ${analysis?.emotion === mood.id ? `selected ${mood.color}` : ""}`}><span className="mood-emoji">{mood.emoji}</span><b>{mood.title}</b><small>{mood.subtitle}</small>{analysis?.emotion === mood.id && <span className="main-emotion">✓ 대표 감정</span>}</article>)}</div>
      </section>}

      {analysis && <section className="analysis-card card" aria-live="polite">
        <div className="analysis-heading"><div><span className="analysis-icon">✦</span><div><h2>Google Gemini 3.1 Flash Lite 감성 분석</h2><p>당신의 마음을 천천히 들여다보았어요</p></div><span className="good-badge">분석 완료</span></div><span className="confidence">감성 읽기　✧</span></div>
        <div className="theme-box"><small>오늘의 마음 한 줄</small><h3>“{analysis.title}”</h3><p>{analysis.summary}</p></div>
        <div className="score-list" aria-label="감정 분석 결과">{analysis.scores.map((score) => <div className="score-row" key={score.emotion}><div><b>{score.emotion}</b><strong>{score.score}%</strong></div><div className="score-track"><span style={{ width: `${score.score}%` }}/></div></div>)}</div>
        <blockquote><b>♥　마인드글로우의 따뜻한 공감 편지</b><p>{analysis.letter}</p></blockquote>
        <div className="reflection-box"><b>오늘의 마음돌봄 질문</b><p>“{analysis.question}”</p></div>
        <button className="restart-result" onClick={restart}>↻　새 일기 쓰기</button>
      </section>}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand"><span className="footer-mark">✦</span><div><b>마인드글로우</b><span>AI 일기 감성 분석</span></div></div>
          <div className="footer-copy"><span>오늘의 마음을 기록하고 다정하게 돌봐 주세요.</span><small>Copyright INU Diary AI Sentiments Analyzer by Semin Kim</small></div>
        </div>
      </footer>
    </main>
  );
}
