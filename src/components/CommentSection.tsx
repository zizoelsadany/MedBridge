'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RatingStars } from './RatingStars';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CommentSectionProps {
  targetId: string;
  targetType: 'book' | 'article';
}

export function CommentSection({ targetId, targetType }: CommentSectionProps) {
  const { comments, addComment, deleteComment, t, language } = useApp();
  const [content, setContent] = useState('');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);

  const targetComments = comments.filter(c => c.targetId === targetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment(targetId, targetType, content, userName, rating);
    setContent('');
    setUserName('');
  };

  return (
    <div className="space-y-8">
      {/* Add comment box */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 shadow-sm">
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-500" />
          {language === 'ar' ? 'أضف تعليقاً أو تقييماً سريرياً' : 'Post Clinical Comment & Review'}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                {language === 'ar' ? 'الاسم أو اللقب الطبي' : 'Your Name / Medical Title'}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={language === 'ar' ? 'د. أحمد علي / طالب طب' : 'Dr. Alex Smith / Med Student'}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                {language === 'ar' ? 'تقييمك' : 'Your Rating'}
              </label>
              <div className="pt-1.5">
                <RatingStars rating={rating} size="md" interactive onRate={(r) => setRating(r)} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
              {language === 'ar' ? 'نص التعليق والملاحظات' : 'Comment Content'}
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب انطباعك عن المحتوى الطبي أو الملاحظات الهامة...' : 'Share your clinical insights or review...'}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all ml-auto"
          >
            <Send className="w-4 h-4" />
            <span>{t('submitComment')}</span>
          </button>
        </form>
      </div>

      {/* List of comments */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span>{language === 'ar' ? 'التعليقات والمناقشات السابقة' : 'Discussions & Reviews'}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800">
            {targetComments.length}
          </span>
        </h4>

        {targetComments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
            {language === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يضيف انطباعه!' : 'No comments yet. Be the first to review!'}
          </div>
        ) : (
          targetComments.map((c) => (
            <div
              key={c._id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {c.userName}
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(c.createdAt, language)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {c.rating && <RatingStars rating={c.rating} size="sm" />}
                  <button
                    onClick={() => deleteComment(c._id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
