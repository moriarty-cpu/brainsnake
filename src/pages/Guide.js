import React, { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase } from '../supabaseClient';
import { CodeBlock } from '../components';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../App.css';

function Guide() {
  const [match, params] = useRoute('/guide/:id');
  const [location, setLocation] = useLocation();
  const [guide, setGuide] = useState(null);
  const [allGuides, setAllGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const guideId = parseInt(params?.id);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: all, error: allError } = await supabase
        .from('guide')
        .select('*')
        .order('id', { ascending: true });

      if (allError) {
        console.error(allError);
        setLoading(false);
        return;
      }

      setAllGuides(all);

      const current = all.find(g => g.id === guideId);
      setGuide(current);
      setLoading(false);
    }

    if (guideId) {
      fetchData();
    }
  }, [guideId]);

  const currentIndex = allGuides.findIndex(g => g.id === guideId);
  const prevGuide = allGuides[currentIndex - 1];
  const nextGuide = allGuides[currentIndex + 1];

  return (
    <main>
      <div>
        {loading ? (
          <>
            <h2><Skeleton width={300} /></h2>
            <p><Skeleton count={4} /></p>
            <Skeleton height={200} />
          </>
        ) : guide ? (
          <>
            <h2>{guide.title}</h2>
            <p>{guide.content}</p>
            <CodeBlock code={guide.code} />
          </>
        ) : (
          <p>Гайд не найден</p>
        )}

        {!loading && (
          <div style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <button
              className='navigateBtn'
              onClick={() => setLocation(`/guide/${prevGuide?.id}`)}
              disabled={!prevGuide}
              style={{ opacity: prevGuide ? 1 : 0.5 }}
            >
              Назад
            </button>

            <button
              className='navigateBtn'
              onClick={() => setLocation(`/guide/${nextGuide?.id}`)}
              disabled={!nextGuide}
              style={{ opacity: nextGuide ? 1 : 0.5 }}
            >
              Далее
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Guide;
