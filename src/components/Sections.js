import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Sections() {
  const [sections, setSections] = useState([]);
  const [subSections, setSubSections] = useState([]);
  const [openedSectionId, setOpenedSectionId] = useState(null);

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
    }

    fetchAll();
  }, []);

  const handleClick = (sectionId) => {
    setOpenedSectionId((prevId) => (prevId === sectionId ? null : sectionId));
  };

  return (
    <ol>
      {sections.map((section) => (
        <li key={section.id}>
          <span
            onClick={() => handleClick(section.id)}
            style={{ cursor: 'pointer'}}>
            {section.title}
          </span>

          {/* Подменю под конкретным элементом */}
          {openedSectionId === section.id && (
            <ol className='subOl'>
              {subSections
                .filter((sub) => sub.section === section.id)
                .map((sub) => (
                  <li key={sub.id}>
                    <span>{sub.title}</span></li>
                ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );
}

export default Sections;
