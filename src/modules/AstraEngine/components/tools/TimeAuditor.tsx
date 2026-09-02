import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

interface TimeAuditorProps {
  onComplete: () => void;
}

interface Activity {
    name: string;
    hours: number;
    [key: string]: any;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export const TimeAuditor: React.FC<TimeAuditorProps> = ({ onComplete }) => {
    const { t } = useTranslations();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivity, setNewActivity] = useState('');
    const [newHours, setNewHours] = useState('');
    const [reflection, setReflection] = useState('');
    
    const handleAddActivity = () => {
        const hours = parseFloat(newHours);
        if (newActivity.trim() && !isNaN(hours) && hours > 0) {
            setActivities(prev => [...prev, { name: newActivity, hours }]);
            setNewActivity('');
            setNewHours('');
        }
    };
    
    const totalHours = activities.reduce((sum, act) => sum + act.hours, 0);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950 text-white">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('tool_timeAuditor_title')}</h1>
                    <p className="text-base md:text-lg text-zinc-400 mb-8">{t('timeAuditor_instructions')}</p>
                </motion.div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800"
                    >
                        <h3 className="text-xl font-bold mb-4">{t('timeAuditor_add_activity')}</h3>
                        <div className="flex gap-2 mb-4">
                            <input type="text" value={newActivity} onChange={e => setNewActivity(e.target.value)} placeholder={t('timeAuditor_activity_placeholder')} className="flex-grow p-2 bg-zinc-800 border border-zinc-700 rounded-md" />
                            <input type="number" value={newHours} onChange={e => setNewHours(e.target.value)} placeholder={t('timeAuditor_hours_placeholder')} className="w-24 p-2 bg-zinc-800 border border-zinc-700 rounded-md" />
                            <button onClick={handleAddActivity} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">
                                <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                            </button>
                        </div>
                        
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                           {activities.map((act, i) => (
                               <div key={i} className="flex justify-between items-center bg-zinc-800/50 p-2 rounded-md">
                                   <span>{act.name}</span>
                                   <span className="font-semibold">{act.hours} {t('timeAuditor_hours_suffix')}</span>
                               </div>
                           ))}
                        </div>
                        {activities.length > 0 && <p className="text-right font-bold mt-4">{t('total')}: {totalHours} {t('timeAuditor_hours_suffix')}</p>}
                     </motion.div>
                     
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 min-h-[300px] md:min-h-[400px]"
                    >
                         <h3 className="text-xl font-bold text-center mb-4">{t('timeAuditor_distribution')}</h3>
                         {activities.length > 0 ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie data={activities} dataKey="hours" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                        {activities.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                         ) : <p className="text-center text-zinc-500 mt-16">{t('timeAuditor_no_data')}</p>}
                    </motion.div>
                </div>
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800"
                >
                    <h3 className="text-xl font-bold text-white mb-2">{t('wheel_reflection_title')}</h3>
                    <p className="text-zinc-400 mb-4">{t('timeAuditor_reflection_prompt')}</p>
                    <textarea value={reflection} onChange={e => setReflection(e.target.value)} className="w-full h-32 p-3 bg-zinc-800/50 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors" />
                </motion.div>

                 <div className="mt-8 text-center">
                    <button onClick={onComplete} className="py-3 px-8 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors">
                        {t('completeAndContinue')}
                    </button>
                </div>
            </div>
        </div>
    );
};