
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SecretTerminalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SecretTerminal = ({ isOpen, onClose }: SecretTerminalProps) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setInput('');
            setError(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim().toLowerCase() === 'admin') {
            navigate('/admin');
            onClose();
        } else {
            setError(true);
            setInput('');
            setTimeout(() => setError(false), 1000);
        }
    };

    if (!isOpen) return null;

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

                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary">
                                <span className="shrink-0">$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="bg-transparent border-none outline-none flex-1 text-sm text-white caret-primary"
                                    autoFocus
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-xs animate-shake">
                                    Permission denied: incorrect identifier
                                </p>
                            )}
                        </form>

                        <p className="text-[10px] text-muted-foreground pt-4">
                            Tip: access restricted to system administrators.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
