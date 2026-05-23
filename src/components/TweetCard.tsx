import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Repeat, Share2, Award, Calendar, BadgePercent, ShieldAlert } from "lucide-react";
import { Tweet, TweetCategory } from "../types";

interface TweetCardProps {
  key?: string;
  tweet: Tweet;
  onRetweet?: (id: string) => void;
  onLike?: (id: string) => void;
}

export default function TweetCard({ tweet, onRetweet, onLike }: TweetCardProps) {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [localLikes, setLocalLikes] = useState(tweet.likes);
  const [localRetweets, setLocalRetweets] = useState(tweet.retweets);

  const handleLike = () => {
    if (liked) {
      setLocalLikes((prev) => prev - 1);
    } else {
      setLocalLikes((prev) => prev + 1);
      if (onLike) onLike(tweet.id);
    }
    setLiked(!liked);
  };

  const handleRetweet = () => {
    if (retweeted) {
      setLocalRetweets((prev) => prev - 1);
    } else {
      setLocalRetweets((prev) => prev + 1);
      if (onRetweet) onRetweet(tweet.id);
    }
    setRetweeted(!retweeted);
  };

  // Get icon for specific category to look highly personalized
  const getCategoryDecorator = (cat: TweetCategory) => {
    switch (cat) {
      case TweetCategory.ELLIOT_WAVES:
        return <Award className="text-red-500 w-4 h-4" />;
      case TweetCategory.BARRANI:
        return <BadgePercent className="text-green-500 w-4 h-4" />;
      case TweetCategory.COSMIC:
        return <ShieldAlert className="text-purple-500 w-4 h-4" />;
      case TweetCategory.GASTRONOMY:
        return <Award className="text-blue-500 w-4 h-4" />;
      default:
        return <BadgePercent className="text-red-500 w-4 h-4" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 bg-white dark:bg-[#121215] rounded border border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Top Category Tag */}
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-zinc-100 dark:border-white/5">
        <div className="flex items-center gap-1.5">
          {getCategoryDecorator(tweet.category)}
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A267] font-extrabold">
            {tweet.category}
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
          <Calendar size={11} />
          {tweet.timestamp}
        </span>
      </div>

      {/* Author Info */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded overflow-hidden border border-[#C5A267] bg-zinc-200 dark:bg-zinc-800 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200" // Simulated premium monochrome portrait photo
            alt="Carlos Maslatón Avatar"
            className="w-full h-full object-cover grayscale brightness-95 filter"
          />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-1.5 leading-snug">
            <span className="font-serif font-bold text-zinc-950 dark:text-white tracking-tight text-base hover:text-[#C5A267] transition-colors cursor-pointer">
              Carlos Maslatón
            </span>
            {/* Verified Badge */}
            <svg
              className="w-4 h-4 text-[#C5A267] fill-current"
              viewBox="0 0 24 24"
              aria-label="Cuenta verificada"
            >
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.406-.17-.866-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.406.17.866.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.5 4L6.5 13l1.5-1.5 2 2 5.5-5.5 1.5 1.5-7 7z" />
            </svg>
            <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono ml-1 uppercase tracking-wide">
              @CarlosMaslaton
            </span>
          </div>

          {/* Actual Tweet Text - EDITORIAL STYLE */}
          <div className="mt-3.5 pl-4 border-l border-[#C5A267]/60 italic font-serif text-[17px] leading-relaxed text-zinc-900 dark:text-zinc-100 break-words whitespace-pre-wrap">
            &quot;{tweet.text}&quot;
          </div>

          {/* Embedded Real-time Market Status if linked */}
          {tweet.marketData && (
            <div className="mt-4 p-4 rounded bg-zinc-50 dark:bg-white/5 border border-zinc-200/60 dark:border-white/5">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                <span className="text-[#C5A267] uppercase tracking-wider">COTIZACIÓN {tweet.marketData.symbol}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider ${
                  tweet.marketData.change >= 0 ? "bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-rose-100/60 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                }`}>
                  {tweet.marketData.change >= 0 ? "BULLISH" : "BEARISH"}
                </span>
              </div>
              <p className="text-base font-bold text-zinc-950 dark:text-white mt-1.5 font-mono">
                USD ${tweet.marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 mt-2 italic font-serif pr-2">
                {tweet.marketData.verdict}
              </p>
            </div>
          )}

          {/* Embedded Space Status if linked */}
          {tweet.spaceData && (
            <div className="mt-4 rounded border border-zinc-200/60 dark:border-white/5 overflow-hidden bg-zinc-50 dark:bg-white/5">
              {tweet.spaceData.imageUrl && (
                <div className="w-full h-36 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] to-transparent opacity-30 z-10"></div>
                  <img
                    src={tweet.spaceData.imageUrl}
                    alt={tweet.spaceData.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 relative z-0"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="p-3.5">
                <p className="text-[10px] font-mono text-[#C5A267] font-bold uppercase tracking-widest">
                  Cosmic Viewport: {tweet.spaceData.title}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-3 font-serif italic">
                  {tweet.spaceData.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center gap-7 mt-5 pt-3.5 border-t border-zinc-100 dark:border-white/5 text-zinc-500 dark:text-zinc-400">
            {/* Retweet trigger */}
            <button
              onClick={handleRetweet}
              className={`flex items-center gap-1.5 text-[10px] font-mono tracking-wider transition-colors group ${
                retweeted ? "text-emerald-500 font-bold" : "hover:text-[#C5A267]"
              }`}
            >
              <Repeat size={14} className={retweeted ? "scale-110 text-emerald-500" : "group-hover:rotate-180 transition-transform duration-300"} />
              <span>{localRetweets}</span>
            </button>

            {/* Like trigger */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[10px] font-mono tracking-wider transition-colors group ${
                liked ? "text-rose-500 font-bold" : "hover:text-[#C5A267]"
              }`}
            >
              <Heart size={14} fill={liked ? "currentColor" : "none"} className={liked ? "scale-125 text-rose-500" : ""} />
              <span>{localLikes}</span>
            </button>

            {/* Share link mock */}
            <button className="flex items-center gap-1.5 text-[10px] font-mono hover:text-[#C5A267] transition-colors">
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
