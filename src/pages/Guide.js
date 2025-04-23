import React from 'react'
import { CodeBlock } from '../components'
import '../App.css'
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Guide() {
    const [guide, setGuide] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGuide() {
            const { data, error } = await supabase.from('Guide').select('*');
            if (error) {
                console.error(error);
            } else {
                setGuide(data);
            }
            setLoading(false);
        }

        fetchGuide();
    }, []);

    if (loading) return <p>Загрузка...</p>;

    return (
        <main>
            {guide.map((guide) => (
                <div key={guide.id} className='container'>
                    <h2>{guide.title}</h2>
                    <p>{guide.content}</p>
                    <CodeBlock code={guide.code} />
                </div>
            ))}
        </main>
    );
}

export default Guide;
