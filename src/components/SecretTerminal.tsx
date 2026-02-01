import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface SecretTerminalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TerminalStep = 'COMMAND' | 'LOGIN' | 'PASSWORD' | 'AUTHENTICATING' | 'SUCCESS' | 'ERROR';

export const SecretTerminal = ({ isOpen, onClose }: SecretTerminalProps) => {
    const [step, setStep] = useState<TerminalStep>('COMMAND');
    const [input, setInput] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            resetTerminal();
        }
    }, [isOpen]);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setStep('SUCCESS');
            setTimeout(() => {
                navigate('/admin');
                onClose();
            }, 500);
            return true;
        }
        return false;
    };

    const resetTerminal = () => {
        setStep('COMMAND');
        setInput('');
        setEmail('');
        setErrorMessage('');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleLogin = async (password: string) => {
        setStep('AUTHENTICATING');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setStep('SUCCESS');
            setTimeout(() => {
                navigate('/admin');
                onClose();
            }, 1000);
        } catch (err: any) {
            setErrorMessage(err.message || 'Login failed');
            setStep('ERROR');
            setInput(''); // Clear immediately to hide even hidden dots if needed
            setTimeout(() => {
                setStep('LOGIN');
                setErrorMessage('');
                setTimeout(() => inputRef.current?.focus(), 100);
            }, 1000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = input.trim();

        if (step === 'COMMAND') {
            if (value.toLowerCase() === 'admin') {
                const isAuthed = await checkSession();
                if (!isAuthed) {
                    setStep('LOGIN');
                    setInput('');
                }
            } else {
                setStep('ERROR');
                setErrorMessage(`command not found: ${value}`);
                setTimeout(() => {
                    setStep('COMMAND');
                    setInput('');
                    setErrorMessage('');
                }, 1000);
            }
        } else if (step === 'LOGIN') {
            if (value) {
                setEmail(value);
                setStep('PASSWORD');
                setInput('');
            }
        } else if (step === 'PASSWORD') {
            handleLogin(input);
        }
    };

    if (!isOpen) return null;

    const getPrompt = () => {
        switch (step) {
            case 'COMMAND': return '$';
            case 'LOGIN': return 'email:';
            case 'PASSWORD': return 'password:';
            default: return '';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-md bg-[#0c0c0c] border border-primary/20 rounded-lg shadow-2xl overflow-hidden font-mono"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Terminal Header */}
                    <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-b border-white/5">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">bash</span>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-6 space-y-4">
                        <div className="text-secondary/80 text-sm">
                            <p>Last login: {new Date().toUTCString()} on ttys001</p>
                            <p className="mt-1">Welcome to quonaro-sh v1.0.4</p>
                        </div>

                        <div className="min-h-[80px] flex flex-col justify-start">
                            {step === 'AUTHENTICATING' ? (
                                <div className="flex items-center gap-2 text-primary animate-pulse">
                                    <span>Verifying credentials...</span>
                                </div>
                            ) : step === 'SUCCESS' ? (
                                <div className="text-green-500">
                                    <span>Access granted. Redirecting...</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                                    <div className="flex items-start gap-2 text-primary">
                                        <span className="shrink-0 mt-[1px]">{getPrompt()}</span>
                                        <div className="flex-1 flex flex-col gap-1">
                                            {step === 'LOGIN' && (
                                                <div className="text-muted-foreground/50 text-xs mb-1">Enter your administrative email</div>
                                            )}
                                            {step === 'PASSWORD' && (
                                                <div className="text-muted-foreground/50 text-xs mb-1">Input hidden for security</div>
                                            )}
                                            <input
                                                ref={inputRef}
                                                type={step === 'PASSWORD' ? 'password' : 'text'}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                className="bg-transparent border-none outline-none w-full text-sm text-white caret-primary"
                                                autoFocus
                                                autoComplete="off"
                                                spellCheck="false"
                                            />
                                        </div>
                                    </div>
                                    {step === 'ERROR' && errorMessage && (
                                        <p className="text-red-500 text-xs animate-shake mt-2">
                                            {errorMessage}
                                        </p>
                                    )}
                                </form>
                            )}
                        </div>

                        <p className="text-[10px] text-muted-foreground pt-4 border-t border-white/5">
                            Tip: type 'admin' to begin authentication process.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
