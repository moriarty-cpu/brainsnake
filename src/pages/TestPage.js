import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from '../supabaseClient';
import { useLocation, useRoute } from "wouter";
import { useAuth } from "../components";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TestPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/test/:id");
  const testId = params?.id;
  const [questions, setQuestions] = useState([]);
  const [answersMap, setAnswersMap] = useState({});
  const [selected, setSelected] = useState({});
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(450);
  const timerRef = useRef();
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!testId) return;
    setLoading(true);
    try {
      const [{ data: qs }, { data: ans }] = await Promise.all([
        supabase.from("question").select("id, text").eq("test_id", testId).limit(15),
        supabase.from("answer").select("id, question_id, text, is_correct"),
      ]);

      const qList = qs || [];
      setQuestions(qList);
      const map = {};
      (ans || []).forEach(a => {
        if (qList.some(q => q.id === a.question_id)) {
          if (!map[a.question_id]) map[a.question_id] = [];
          map[a.question_id].push(a);
        }
      });
      setAnswersMap(map);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleChange = (qid, aid) => {
    setSelected(s => ({ ...s, [qid]: aid }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (questions.length && Object.keys(selected).length !== questions.length) {
      setError('Пожалуйста, ответьте на все вопросы.');
      return;
    }

    clearInterval(timerRef.current);
    // Подсчет правильных ответов
    let correctCount = questions.reduce((count, q) => {
      const selId = selected[q.id];
      const answer = answersMap[q.id].find(a => a.id === selId);
      return count + (answer?.is_correct ? 1 : 0);
    }, 0);

    const stars = Math.min(5, Math.floor(correctCount / 3));
    const trophy = timeLeft < 270 && stars === 5;

    try {
  const { data: prev, error: prevErr } = await supabase
    .from('test_attempt')
    .select('stars')
    .eq('user_id', user.id)
    .eq('test_id', testId)
    .maybeSingle(); // ← Ключевое изменение

  if (prevErr) {
    if (prevErr.code === 'PGRST116') { // Пустой результат - это нормально
      console.log('Первая попытка');
    } else {
      throw prevErr;
    }
  }

  if (!prev || (prev.stars < stars)) {
    await supabase.from('test_attempt').upsert({
      user_id: user.id,
      test_id: +testId,
      stars,
      trophy,
    });
  }
} catch (err) {
  console.error('Ошибка сохранения попытки:', err);
}

    navigate('/test');
  };

  if (!match) return <div>Loading...</div>;

  if (loading) {
    return (
      <main>
        <div className="test-container">
          <Skeleton width={200} height={30} />
          <Skeleton width={150} height={20} />
          {Array(15).fill().map((_, i) => (
            <div key={i} className="question-skeleton">
              <Skeleton width={300} height={20} />
              <div>
                {Array(4).fill().map((_, j) => (
                  <Skeleton key={j} width={250} height={15} />
                ))}
              </div>
            </div>
          ))}
          <Skeleton width={120} height={40} />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div>
        <h2>Тест {testId}</h2>
        <div>Времени осталось: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
        <form>
          {questions.map((q, idx) => (
            <div key={q.id} style={{ marginBottom: '1em' }}>
              <p>{idx + 1}. {q.text}</p>
              {answersMap[q.id]?.map(a => (
                <label key={a.id} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={a.id}
                    checked={selected[q.id] === a.id}
                    onChange={() => handleChange(q.id, a.id)}
                  /> {a.text}
                </label>
              ))}
            </div>
          ))}
        </form>
        {error && <div style={{ color: 'red', margin: '1em 0' }}>{error}</div>}
        <button className='btn' onClick={handleSubmit}>Отправить</button>
      </div>
    </main>
  );
}
