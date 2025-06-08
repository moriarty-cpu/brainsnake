import { useLocation } from "wouter";
import { Star, Award } from "lucide-react";

export default function TestResult() {
  const [location, setLocation] = useLocation();
  const stored = sessionStorage.getItem('testResult');
  const result = stored ? JSON.parse(stored) : null;

  if (!result) return <div>Нет данных теста</div>;
  const { stars, trophy, time, rightAnswer, testId } = result;

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} мин. ${secs} сек.`;
  };

  return (
    <main>
      <div style={{
        height: 'calc(100vh - 100px)',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
      }}>
        <h2 style={{ color: '#7c203a' }}>
          Тест пройден!
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // margin: '1rem 0'
        }}>
          {[...Array(5)].map((_, i) => (
            <Star
              strokeWidth='1px'
              key={i}
              size={40}
              color="#7c203a"
              fill={i < stars ? "#f9ff21" : "transparent"}
              style={{ margin: '0 2px' }}
            />
          ))}
          {trophy && (
            <Award
              strokeWidth='1px'
              size={40}
              color="#7c203a"
              fill="#f9ff21"
              style={{ marginLeft: '5px' }}
            />
          )}
        </div>

        <div style={{
          fontSize: '1.1rem',
          margin: '1rem 0',
          lineHeight: '1.6'
        }}>
          <p>Правильных ответов: {rightAnswer}</p>
          <p>Затраченное время: {formatTime(time)}</p>
        </div>

        <div style={{
          // marginTop: '2rem',
          display: 'flex',
          gap: '3rem',
          justifyContent: 'center'
        }}>
          <button
            className='btn'
            onClick={() => setLocation(`/test/${testId}`)}
            style={{ padding: '10px 20px' }}
          >
            Повторить
          </button>
          <button
            className='btn'
            onClick={() => setLocation('/test')}
            style={{ padding: '10px 20px' }}
          >
            Завершить
          </button>
        </div>
      </div>
    </main>
  );
}