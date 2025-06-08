import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './index';
import '../App.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Star, Award, Trophy } from "lucide-react";

export default function UserCard({ number, star, trophy }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user: User } = useAuth();
    const userId = User.id
    useEffect(() => {
        async function fetchAll() {
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Ошибка:', error);
            } else {
                setUser(data);
            }

            setLoading(false);
        }

        if (userId) {
            fetchAll();
        }
    }, [userId]);



    if (loading || !user) {
        return (
            <div className="userCard">
                <div className="userCardImgWrapper">
                    <Skeleton
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '100%'
                        }}
                    />
                </div>
                <Skeleton style={{ marginTop: 10, height: 15, width: 100 }} />
                <Skeleton style={{ marginTop: 10, height: 25, width: 120 }} />
                <Skeleton style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '87px',
                    height: '52px',
                    borderRadius: '15px',
                }} />
            </div>
        );
    }

    return (
        <div className="userCard">
            <div className="userCardImgWrapper">
                <img className="userCardImg" src={user.photo_url} alt="avatar" />
            </div>
            <span style={{ fontSize: '0.8rem', marginTop: '10px' }}>{user.username ? "@" + user.username : ""}</span>
            <span style={{ fontSize: '1.5rem', marginTop: '10px' }}>
                {user.first_name} {user.last_name}
            </span>
            <div className='userRatingCard'>
                <div>
                    <Trophy size={24} strokeWidth='1.5px' fill='#f9ff21' stroke="#7c203a" />
                    <span>{number == 0 ? '-' : `#${number}`}</span>
                </div>
                <div>
                    <Star strokeWidth='1.5px' fill='#f9ff21' stroke="#7c203a" />
                    <span> {star}</span>
                </div>
                <div>
                    <Award strokeWidth='1.5px' fill='#f9ff21' stroke="#7c203a" />
                    <span>{trophy}</span>
                </div>

            </div>
        </div>
    );

}
