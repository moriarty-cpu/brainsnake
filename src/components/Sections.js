import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from "wouter";

function Sections() {
  const [sections, setSections] = useState([]);
  const [guides, setGuides] = useState([]);
  const [openedSectionId, setOpenedSectionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const { data: sectionsData, error: sectionError } = await supabase.from('section').select('*');
      const { data: guidesData, error: guideError } = await supabase.from('guide').select('*');

      if (sectionError || guideError) {
        console.error('Ошибка загрузки данных:', sectionError || guideError);
      } else {
        setSections(sectionsData);
        setGuides(guidesData);
      }

      setLoading(false);
    }

    fetchAll();
  }, []);

  const handleClick = (sectionId) => {
    setOpenedSectionId((prevId) => (prevId === sectionId ? null : sectionId));
  };

  if (loading) {
    return (
      <ol>
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}>
            <Skeleton height={20} width={200} />
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol>
      {sections.map((section) => (
        <li key={section.id}>
          <span
            onClick={() => handleClick(section.id)}
            style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            {section.title}
          </span>

          {openedSectionId === section.id && (
            <ol className="subOl" style={{ marginLeft: '1rem' }}>
              {guides
                .filter((guide) => guide.section === section.id)
                .map((guide) => (
                  <li key={guide.id}>
                    <Link href={`/guide/${guide.id}`}>
                      <span>{guide.title || 'Без названия'}</span>
                    </Link>
                  </li>
                ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );
}

export default Sections;
