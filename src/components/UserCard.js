import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './index';
import '../App.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function UserCard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user:User } = useAuth();
    const userId= User.id
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

            setLoading(false); // <-- перемещено сюда
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
            </div>
        );
    }
    
    return (
        <div className="userCard">
            <div className="userCardImgWrapper">
                <img className="userCardImg" src={user.photo_url} alt="avatar" />
            </div>
            <span style={{ fontSize: '0.8rem', marginTop: '10px' }}>@{user.username}</span>
            <span style={{ fontSize: '1.5rem', marginTop: '10px' }}>
                {user.first_name} {user.last_name}
            </span>
        </div>
    );
    
}
