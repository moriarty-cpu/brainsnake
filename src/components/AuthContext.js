import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (!tgUser) {
      setLoading(false);
      return;
    }
    const { id, first_name, last_name = '', username = '', photo_url = '' } = tgUser;

    (async () => {
      const { data: existingUser, error: selectErr } = await supabase
        .from('user')
        .select('*')
        .eq('id', parseInt(id))
        .maybeSingle();
      if (selectErr) console.error(selectErr);

      let dbUser = existingUser;
      if (!existingUser) {
        const { data: newUser, error: insertErr } = await supabase
          .from('user')
          .insert([{ id: parseInt(id), first_name, last_name, username, photo_url }])
          .single();
        if (insertErr) console.error(insertErr);
        dbUser = newUser;
      }

      setUser(dbUser);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}