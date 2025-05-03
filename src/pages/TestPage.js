import React, { useEffect, useState, useRef } from "react";
import { supabase } from '../supabaseClient';
import { useLocation, useRoute } from "wouter";

export default function TestPage({ userId }) {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/test/:id");
  const testId = params?.id;
  const [questions, setQuestions] = useState([]);
  const [answersMap, setAnswersMap] = useState({});
  const [timeLeft, setTimeLeft] = useState(180);
  const timerRef = useRef();

  useEffect(() => {
    if (!testId) return;
    async function load() {
      const { data: qs } = await supabase
        .from("question")
        .select("id, text")
        .eq("test_id", testId)
        .limit(15);
      setQuestions(qs || []);

      const qIds = (qs || []).map(q => q.id);
      const { data: ans } = await supabase
        .from("answer")
        .select("id, question_id, text, is_correct")
        .in("question_id", qIds);
      const map = {};
      (ans || []).forEach(a => {
        if (!map[a.question_id]) map[a.question_id] = [];
        map[a.question_id].push(a);
      });
      setAnswersMap(map);
    }
    load();

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [testId]);

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    let correctCount = 0;
    questions.forEach(q => {
      const sel = document.querySelector(`input[name=q${q.id}]:checked`);
      if (!sel) return;
      const a = answersMap[q.id].find(x => x.id === +sel.value);
      if (a?.is_correct) correctCount += 1;
    });
    const stars = Math.min(5, Math.floor(correctCount / 3));
    const trophy = timeLeft > 0;

    await supabase.from('test_attempt').insert([{ 
      user_id: userId,
      test_id: testId,
      correct_cnt: correctCount,
      stars,
      trophy,
      finished_at: new Date().toISOString()
    }]);

    await supabase.from('rating')
      .upsert({
        id_user: userId,
        test_id: testId,
        star: stars,
        trophy,
        finished_at: new Date().toISOString()
      }, { onConflict: ['id_user', 'test_id'] })
      .gt('star', stars);

    navigate('/');
  };

  if (!match) return <div>Loading...</div>;

  return (
    <div>
      <h2>Test: {testId}</h2>
      <div>Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
      <form>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: '1em' }}>
            <p>{idx + 1}. {q.text}</p>
            {answersMap[q.id]?.map(a => (
              <label key={a.id} style={{ display: 'block' }}>
                <input type="radio" name={`q${q.id}`} value={a.id} /> {a.text}
              </label>
            ))}
          </div>
        ))}
      </form>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
