import React, { useState } from 'react';
import { Heart, Lock, Shield, Trash2, Send, User, Image as ImageIcon, Smile } from 'lucide-react';
import { useConfessions } from './hooks/useConfessions';
import { Confession } from './types';
import { motion, AnimatePresence } from 'motion/react';

function Header() {
  return (
    <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
          <Heart size={20} fill="currentColor" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">KindHeart</span>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
        <a href="#" className="hover:text-rose-600 transition-colors">Feed</a>
        <a href="#" className="hover:text-rose-600 transition-colors">Privacy</a>
        <a href="#" className="hover:text-rose-600 transition-colors">About</a>
      </nav>
      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer">
        <Heart size={20} fill="currentColor" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="text-center mt-16 mb-12 px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
        Share your heart,<br />
        <span className="text-rose-500">anonymously.</span>
      </h1>
      <p className="text-gray-500 text-lg max-w-md mx-auto">
        A safe, private space for your unspoken thoughts and deepest reflections.
      </p>
    </div>
  );
}

function ConfessionForm({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const maxLength = 1000;

  const handleSubmit = () => {
    if (text.trim().length > 0 && text.length <= maxLength) {
      onPost(text);
      setText('');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-rose-100/50 p-6 md:p-8 mb-12 border border-rose-50">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
          <User size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Incognito Soul</h3>
          <p className="text-sm text-gray-400">Your identity is hidden</p>
        </div>
      </div>

      <div className="relative mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's weighing on your heart tonight?"
          className="w-full h-40 bg-gray-50/50 rounded-2xl p-5 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none transition-all"
        />
        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-rose-600"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-3">
                <Heart size={24} fill="currentColor" />
              </div>
              <p className="font-medium">Your confession is safe with us.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-4 right-4 flex items-center gap-3 text-gray-400">
          <button className="hover:text-rose-500 transition-colors"><ImageIcon size={20} /></button>
          <button className="hover:text-rose-500 transition-colors"><Smile size={20} /></button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-medium text-gray-400 mb-6 px-1">
        <span className="uppercase tracking-wider">Character Limit</span>
        <span>{text.length} / {maxLength}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Lock size={16} />
          <span>End-to-end encrypted</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={text.trim().length === 0 || text.length > maxLength || isSuccess}
          className="w-full sm:w-auto px-8 py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/30"
        >
          Post Confession <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-gray-400 mb-20">
      <div className="flex items-center gap-2">
        <Shield size={18} />
        <span>100% Anonymous</span>
      </div>
      <div className="flex items-center gap-2">
        <Trash2 size={18} />
        <span>Auto-delete History</span>
      </div>
      <div className="flex items-center gap-2">
        <Heart size={18} />
        <span>Safe Community</span>
      </div>
    </div>
  );
}

const ConfessionItem: React.FC<{ confession: Confession, onLike: (c: Confession) => void }> = ({ confession, onLike }) => {
  const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  let timeString = 'recently';
  
  if (confession.created_at) {
    const diffInSeconds = (Date.now() - new Date(confession.created_at).getTime()) / 1000;
    if (diffInSeconds < 60) timeString = 'just now';
    else if (diffInSeconds < 3600) timeString = timeAgo.format(-Math.floor(diffInSeconds / 60), 'minute');
    else if (diffInSeconds < 86400) timeString = timeAgo.format(-Math.floor(diffInSeconds / 3600), 'hour');
    else timeString = timeAgo.format(-Math.floor(diffInSeconds / 86400), 'day');
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
          <User size={20} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm">Anonymous</h4>
          <p className="text-xs text-gray-400">{timeString}</p>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap mb-6 leading-relaxed">
        {confession.confessions}
      </p>
      <div className="flex items-center gap-6 border-t border-gray-50 pt-4">
        <button 
          onClick={() => onLike(confession)}
          className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors group"
        >
          <Heart size={20} className="group-hover:fill-rose-500/20" />
          <span className="text-sm font-medium">{confession.likes}</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  const { confessions, addConfession, likeConfession, isLoading, error } = useConfessions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white font-sans selection:bg-rose-200 selection:text-rose-900">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 pb-20">
        <Hero />
        
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <ConfessionForm onPost={addConfession} />
        <Features />
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 px-2">Recent Confessions</h2>
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">
              <div className="animate-pulse flex flex-col items-center">
                <Heart size={48} className="mx-auto mb-4 opacity-20" />
                <p>Loading confessions...</p>
              </div>
            </div>
          ) : confessions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Heart size={48} className="mx-auto mb-4 opacity-20" />
              <p>No confessions yet. Be the first to share your heart.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {confessions.map((confession, index) => (
                  <ConfessionItem 
                    key={confession.id || index} 
                    confession={confession} 
                    onLike={likeConfession}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-gray-400 border-t border-rose-50">
        <p>© {new Date().getFullYear()} KindHeart Confessions. Built for healing.</p>
      </footer>
    </div>
  );
}
