import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                toast.success(t('admin.login.success'));
                navigate('/admin');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-8 bg-surface p-8 rounded-xl border border-subtle">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">{t('admin.login.title')}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{t('admin.login.subtitle')}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <Input
                            type="email"
                            placeholder={t('admin.login.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-background"
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder={t('admin.login.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-background"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? t('admin.login.loading') : t('admin.login.submit')}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
