import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from "wouter";

function Sections() {
  const [sections, setSections] = useState([]);
  const [subSections, setSubSections] = useState([]);
  const [openedSectionId, setOpenedSectionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const { data: sectionsData, error: sectionError } = await supabase.from('Section').select('*');
      const { data: subSectionsData, error: subSectionError } = await supabase.from('Subsection').select('*');

      if (sectionError || subSectionError) {
        console.error('Ошибка загрузки данных:', sectionError || subSectionError);
      } else {
        setSections(sectionsData);
        setSubSections(subSectionsData);
      }

      setLoading(false);
    }

    fetchAll();
  }, []);

  const handleClick = (sectionId) => {
    setOpenedSectionId((prevId) => (prevId === sectionId ? null : sectionId));
  };

  if (loading) {
    // 👇 Показываем 5 скелетонов вместо настоящих данных
    return (
      <ol>
        {Array.from({ length: 18 }).map((_, i) => (
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
              {subSections
                .filter((sub) => sub.section === section.id)
                .map((sub) => (
                  <li key={sub.id}>
                    <Link href="/guide">
                      <span>{sub.title}</span>
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
