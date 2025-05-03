import React, { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { useLocation } from "wouter";
import { Star, Trophy } from "lucide-react";
import { useAuth } from "../components"

export default function TestsList() {
    const [tests, setTests] = useState([]);
    const [ratings, setRatings] = useState({});
    const [, navigate] = useLocation();
    const { user:User } = useAuth();
    const userId = User.id

    useEffect(() => {
        async function load() {
            const { data: testsData, error: tErr } = await supabase
                .from("test")
                .select("id, title");
            if (tErr) console.error(tErr);

            const { data: ratingData, error: rErr } = await supabase
                .from("rating")
                .select("id_user, test_id, star, trophy, finished_at")
                .eq("id_user", userId);
            if (rErr) console.error(rErr);

            const map = {};
            (ratingData || []).forEach(r => { map[r.test_id] = r; });

            setTests(testsData || []);
            setRatings(map);
        }
        load();
    }, [userId]);

    return (
        <main>
            <div>
                <h2>Доступные тесты</h2>
                <ul style={{
                    listStyle: 'none',
                }}>
                    {tests.map(t => {
                        const best = ratings[t.id] || { star: 0, trophy: false };
                        return (
                            <li key={t.id} style={{ marginBottom: '1em' }}>
                                <span
                                    onClick={() => navigate(`/test/${t.id}`)}
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    {t.title}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5em' }}>
                                    {/* Звёзды */}
                                    {[...Array(5)].map((_, i) => (
                                        // <Star
                                        //     key={i}
                                        //     size={20}
                                        //     color={i < best.star ? '#FFD700' : '#555'}
                                        //     style={{ marginRight: 4 }}
                                        // />
                                        <Star fill={i < best.star ? "#FFD700" : "none"} stroke="#FFD700" />
                                    ))}
                                    {/* Трофей */}
                                    <Trophy
                                        size={24}
                                        color={best.trophy ? '#FFD700' : '#555'}
                                        style={{ marginLeft: 12 }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </main >
    );
}
