import React, { useState, useEffect } from 'react';
import { mockService } from '../../services/MockService';
import type { Notification, NotificationCategory } from '../../types/domain';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | NotificationCategory>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            try {
                const data = await mockService.listNotifications();
                setNotifications(data);
            } finally {
                setIsLoading(false);
            }
        };
        if (isOpen) fetchNotifications();
    }, [isOpen]);

    const filteredNotifications = notifications.filter(n =>
        activeTab === 'all' || n.category === activeTab
    );

    const getGlowClass = (category: NotificationCategory) => {
        switch (category) {
            case 'action': return 'glow-red';
            case 'protected': return 'glow-green';
            case 'system': return 'glow-blue';
            default: return '';
        }
    };

    const getIcon = (category: NotificationCategory) => {
        switch (category) {
            case 'action': return 'contract_edit';
            case 'protected': return 'verified_user';
            case 'system': return 'gavel';
            default: return 'notifications';
        }
    };

    const getIconBg = (category: NotificationCategory) => {
        switch (category) {
            case 'action': return 'bg-danger-glow/20 text-danger-glow';
            case 'protected': return 'bg-success-glow/20 text-success-glow';
            case 'system': return 'bg-info-glow/20 text-info-glow';
            default: return 'bg-white/10 text-white';
        }
    };

    return (
        <aside className={`glass-panel w-[400px] h-full fixed right-0 top-0 z-[60] flex flex-col transition-transform duration-500 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="p-6 border-b border-white/10 mt-16 lg:mt-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight text-white font-display">Notification Center</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex gap-2">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'action', label: 'Action Required' },
                        { id: 'system', label: 'System' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-[0_0_12px_rgba(48,137,118,0.4)]'
                                : 'bg-white/5 text-text-muted hover:bg-white/10'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-text-muted">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-medium uppercase tracking-widest">Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-text-muted">
                        <span className="material-symbols-outlined text-4xl opacity-20">notifications_off</span>
                        <p className="text-sm font-medium">No notifications in this category.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Grouping by category if "All" is selected */}
                        {activeTab === 'all' ? (
                            <>
                                {['action', 'protected', 'system'].map(cat => {
                                    const catItems = filteredNotifications.filter(n => n.category === cat);
                                    if (catItems.length === 0) return null;
                                    return (
                                        <div key={cat} className="space-y-4">
                                            <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">
                                                {cat === 'action' ? 'Action Required' : cat === 'protected' ? 'Protected' : 'System Updates'}
                                            </h3>
                                            {catItems.map(notif => (
                                                <NotificationCard key={notif.id} notif={notif} icon={getIcon(notif.category as any)} iconBg={getIconBg(notif.category as any)} glowClass={getGlowClass(notif.category as any)} />
                                            ))}
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            filteredNotifications.map(notif => (
                                <NotificationCard key={notif.id} notif={notif} icon={getIcon(notif.category as any)} iconBg={getIconBg(notif.category as any)} glowClass={getGlowClass(notif.category as any)} />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-text-muted">Status</span>
                    <span className="flex items-center gap-1.5 text-xs text-success-glow">
                        <span className="size-1.5 bg-success-glow rounded-full animate-pulse"></span>
                        Live Connection
                    </span>
                </div>
                <div className="bg-black/40 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="size-8 bg-primary/20 rounded flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-xl">shield</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-text-muted font-bold uppercase leading-none">Subscription</p>
                        <p className="text-xs text-white font-medium">Enterprise Tier Active</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const NotificationCard: React.FC<{ notif: Notification, icon: string, iconBg: string, glowClass: string }> = ({ notif, icon, iconBg, glowClass }) => {
    return (
        <div className={`notification-card ${glowClass} rounded-lg p-4 group relative overflow-hidden`}>
            <div className="flex gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-white tracking-tight">{notif.title}</h4>
                        <span className="text-[10px] text-text-muted">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1 leading-normal">{notif.message}</p>

                    {notif.category === 'action' && (
                        <div className="mt-4 flex gap-2">
                            <button className="bg-primary hover:bg-primary/80 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all shadow-[0_2px_8px_rgba(48,137,118,0.3)]">
                                Resend Link
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg border border-white/10 transition-colors">
                                Call Buyer
                            </button>
                        </div>
                    )}

                    {notif.category === 'protected' && (
                        <button className="mt-3 w-full bg-white/5 hover:bg-white/10 text-primary text-[11px] font-bold py-2 rounded-lg border border-primary/30 flex items-center justify-center gap-2 transition-all group-hover:border-primary/50">
                            <span className="material-symbols-outlined text-sm">download</span>
                            View Certificate
                        </button>
                    )}

                    {notif.category === 'action' && (
                        <p className="text-[10px] text-text-muted mt-3">Priority: {notif.priority.toUpperCase()} • {new Date(notif.timestamp).toLocaleDateString()}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
