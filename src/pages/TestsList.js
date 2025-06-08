import React, { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { useLocation } from "wouter";
import { Star, Trophy, Award } from "lucide-react";
import { useAuth } from "../components"
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../App.css'

export default function TestsList() {
    const [tests, setTests] = useState([]);
    const [test_attempt, setTest_attempt] = useState({});
    const [loading, setLoading] = useState(true);
    const [, navigate] = useLocation();
    const { user: User } = useAuth();
    const userId = User.id;

    useEffect(() => {
        const loadData = async () => {
            try {
                const [{ data: testsData }, { data: attemptsData }] = await Promise.all([
                    supabase.from("test").select("id, title"),
                    supabase.from("test_attempt").select("*").eq("user_id", userId)
                ]);

                const attemptsMap = (attemptsData || []).reduce((acc, r) => {
                    acc[r.test_id] = r;
                    return acc;
                }, {});

                setTests(testsData || []);
                setTest_attempt(attemptsMap);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    if (loading) {
        return (
            <main>
                <div>
                    <h2>Доступные тесты</h2>
                    <ul className="tests-list">
                        {Array(10).fill().map((_, i) => (
                            <Skeleton style={{
                                marginBottom: '1rem',
                                borderRadius: '15px',
                                maxWidth: '165px',
                                width: '165px',
                                height: '54px',
                            }} />
                        ))}
                    </ul>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div>
                <h2>Доступные тесты</h2>
                <ul className="tests-list">
                    {tests.map(t => {
                        const best = test_attempt[t.id] || { stars: 0, trophy: false };
                        return (
                            <li
                                key={t.id}
                                className="test-item"
                                onClick={() => navigate(`/test/${t.id}`)}
                            >
                                <span className="test-title">{t.title}</span>
                                <div className="test-rating">
                                    <div className="icon-container">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                             strokeWidth='1.7px'
                                                key={i}
                                                size={20}
                                                color="#7c203a"
                                                fill={i < best.stars ? "#d5f007" : "#7c203a"}
                                            />
                                        ))}
                                    </div>
                                    {best.trophy && (
                                        <Award
                                         strokeWidth='1.7px'
                                            style={{ marginLeft: 5 }}
                                            size={20}
                                            color="#7c203a"
                                            fill="#d5f007"
                                        />
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </main>
    );
}