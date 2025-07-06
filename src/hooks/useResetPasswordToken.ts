import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useResetPasswordToken = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur de session:', error);
        setError('Lien de réinitialisation invalide ou expiré');
        return;
      }
      
      if (!data.session) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const tokenHash = hashParams.get('token_hash') || queryParams.get('token_hash');
        const type = hashParams.get('type') || queryParams.get('type');
        
        if (tokenHash && type === 'recovery') {
          try {
            const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(tokenHash);
            if (exchangeError) {
              console.error('Erreur d\'échange de token:', exchangeError);
              setError('Lien de réinitialisation invalide ou expiré');
            }
          } catch (err) {
            console.error('Erreur lors de l\'échange de token:', err);
            setError('Lien de réinitialisation invalide ou expiré');
          }
        } else if (accessToken && refreshToken) {
          try {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
          } catch (err) {
            console.error('Erreur de session:', err);
            setError('Lien de réinitialisation invalide ou expiré');
          }
        } else {
          setError('Lien de réinitialisation manquant ou invalide');
        }
      }
    };
    
    handleAuthCallback();
  }, []);

  return { error };
};