import React, { useState, useEffect } from 'react';
import { mockService } from '../services/MockService';
import type { Activity } from '../types/domain';

export const ActivityCenterPage: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            setIsLoading(true);
            try {
                const data = await mockService.listActivities();
                setActivities(data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, []);

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col gap-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-bold text-white tracking-tight font-display mb-2">Activity Feed</h1>
                <p className="text-text-muted text-base">Live tracking of your commission pipeline and buyer interactions.</p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-primary/30 transition-all duration-300">
                    <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Total Protected</p>
                    <h3 className="text-3xl font-bold text-primary tracking-tight font-display">$142,500</h3>
                    <div className="flex items-center gap-1 mt-2 text-success-glow text-xs font-bold">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+12.4% vs last month</span>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-white/20 transition-all duration-300">
                    <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Active Leads</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight font-display">18</h3>
                    <p className="text-text-muted text-xs mt-2 font-medium">6 requiring signature</p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-white/20 transition-all duration-300">
                    <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Lead Health</p>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[85%] shadow-[0_0_8px_rgba(48,137,118,0.5)]"></div>
                        </div>
                        <span className="text-sm font-bold text-white font-display">85%</span>
                    </div>
                </div>
            </div>

            {/* Timeline Feed */}
            <div className="space-y-2 relative">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-muted">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold uppercase tracking-widest">Initialising Timeline...</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-20 text-text-muted bg-white/5 rounded-xl border border-dashed border-white/10">
                        <span className="material-symbols-outlined text-5xl mb-4 opacity-20">history</span>
                        <p className="text-lg">No activity history yet.</p>
                        <p className="text-sm">Start inviting buyers to see live tracking.</p>
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <div key={activity.id} className="relative pl-12 pb-10 group last:pb-0">
                            {/* Timeline Line */}
                            {index !== activities.length - 1 && <div className="timeline-line group-hover:bg-primary/30 transition-colors"></div>}

                            {/* Activity Icon */}
                            <div className={`absolute left-0 top-1 size-7 rounded-full flex items-center justify-center z-10 shadow-lg transition-transform duration-300 group-hover:scale-110 ${activity.type === 'agreement_signed' ? 'bg-primary text-white' :
                                activity.type === 'terms_reviewed' ? 'bg-info-glow text-white' :
                                    'bg-primary/40 text-white'
                                }`}>
                                <span className="material-symbols-outlined text-base">
                                    {activity.type === 'agreement_signed' ? 'done_all' :
                                        activity.type === 'terms_reviewed' ? 'visibility' :
                                            'link'}
                                </span>
                            </div>

                            {/* Content Card */}
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 backdrop-blur-[2px]">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-white text-lg tracking-tight font-display group-hover:text-primary transition-colors">{activity.title}</h4>
                                    <span className="text-text-muted text-xs font-medium bg-white/5 px-2 py-1 rounded">
                                        {new Date(activity.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-text-muted text-sm leading-relaxed mb-4 max-w-3xl">
                                    {activity.description}
                                </p>

                                <div className="flex gap-2">
                                    {activity.statusTag && (
                                        <span className="px-2.5 py-1 rounded bg-success-glow/10 text-success-glow text-[10px] font-bold uppercase tracking-wider border border-success-glow/20">
                                            {activity.statusTag}
                                        </span>
                                    )}
                                    <span className="px-2.5 py-1 rounded bg-white/5 text-text-muted text-[10px] font-bold uppercase tracking-wider border border-white/10 group-hover:bg-white/10 transition-colors">
                                        Real-time
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
};
