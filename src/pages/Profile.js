import React, { useState, useEffect } from 'react';
import { UserCard, useAuth } from '../components';
import { supabase } from '../supabaseClient';
import { Star, Trophy, Award } from "lucide-react";
import 'react-loading-skeleton/dist/skeleton.css';
import '../App.css';
import Skeleton from 'react-loading-skeleton';

export default function Profile() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRes, setUserRes] = useState({
    number: 0,
    stars: 0,
    trophies: 0
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase.rpc('get_leaderboard');

        if (error) throw error;

        const currentUserData = data.find(u => u.id === user?.id);
        if (currentUserData) {
          setUserRes({
            number: data.indexOf(currentUserData) + 1,
            stars: currentUserData.total_stars,
            trophies: currentUserData.total_trophies
          });
        }

        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user?.id]);

  return (
    <main>
      <div>
        {user ? (
          <UserCard
            number={userRes.number.toString()}
            star={userRes.stars.toString()}
            trophy={userRes.trophies.toString()}
          />
        ) : <div>Пользователь не найден!</div>}

        <div className="leaderboard-container">
          <h2>Топ пользователей</h2>
          <div className="leaderboard-list">
            {loading ? (
              Array(5).fill().map((_, index) => (
                <Skeleton key={index} style={{
                  height: '65px',
                  borderRadius: '15px',
                  marginBottom: '3px',
                }} />
              ))
            ) : error ? (
              <div>Ошибка: {error}</div>
            ) : (
              leaderboard.filter(user => user.total_stars > 0).map((user, index) => (
                <div key={user.id} className="leaderboard-item">
                  <div className="leaderboard-left">
                    <div>#{index + 1}</div>
                    <img
                      src={user.photo_url || ''}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="user-photo"
                    />
                    <div>{user.first_name}</div>
                  </div>
                  <div className="leaderboard-right">
                    <div className="stat-item">
                      <Star strokeWidth='1.5px' fill='#f9ff21' stroke="#7c203a" />
                      <div className="stat-value">{user.total_stars}</div>
                    </div>
                    <div className="stat-item">
                      <Award strokeWidth='1.5px' fill='#f9ff21' stroke="#7c203a" />
                      <div className="stat-value">{user.total_trophies}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
