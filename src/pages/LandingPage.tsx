import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [dealVolume, setDealVolume] = useState(24);
    const [homePrice, setHomePrice] = useState(450000);

    const protectedRevenue = dealVolume * homePrice * 0.03;

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-white">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-accent-glow/20 blur-[100px] pointer-events-none z-0"></div>

            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full glass-panel border-b-0 border-b-glass-border">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 text-primary">
                            <span className="material-symbols-outlined text-[32px]">shield_lock</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white font-display">Dwellingly</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium text-text-secondary hover:text-white transition-colors" href="#">Solutions</a>
                        <a className="text-sm font-medium text-text-secondary hover:text-white transition-colors" href="#">ROI Calculator</a>
                        <a className="text-sm font-medium text-text-secondary hover:text-white transition-colors" href="#">Pilot Program</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:block text-sm font-medium text-text-secondary hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(48,136,117,0.4)] hover:shadow-[0_0_25px_rgba(48,136,117,0.6)]">
                            Join the Pilot
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 flex-grow flex flex-col items-center">
                {/* Hero Section */}
                <section className="w-full max-w-7xl px-6 py-20 lg:py-32 flex flex-col items-center text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-glow-gradient pointer-events-none"></div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-medium text-primary tracking-wide uppercase">New: Post-Settlement Framework</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6 max-w-4xl text-glow font-display">
                        Your Income, Protected by <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white animate-pulse">Infrastructure™</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 font-light leading-relaxed">
                        The MLS commission guarantee is gone. Dwellingly replaces it with a legally binding buyer representation framework. Secure your future revenue today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="bg-primary hover:bg-primary/90 text-white text-lg font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(48,136,117,0.5)] hover:shadow-[0_0_30px_rgba(48,136,117,0.7)] hover:-translate-y-1 flex items-center justify-center gap-2">
                            Join the Pilot
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                        <button className="glass-panel hover:bg-white/5 text-white text-lg font-bold px-8 py-4 rounded-xl transition-all border border-white/20 hover:border-primary/50 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">play_circle</span>
                            Watch 2-Min Demo
                        </button>
                    </div>

                    {/* Stats strip */}
                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
                        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/5">
                            <span className="text-3xl font-bold text-white tracking-tight font-display">$15M+</span>
                            <span className="text-sm text-text-secondary uppercase tracking-wider">Commissions Secured</span>
                        </div>
                        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/5">
                            <span className="text-3xl font-bold text-white tracking-tight font-display">500+</span>
                            <span className="text-sm text-text-secondary uppercase tracking-wider">Pilot Agents</span>
                        </div>
                        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/5">
                            <span className="text-3xl font-bold text-primary tracking-tight font-display">$300x</span>
                            <span className="text-sm text-text-secondary uppercase tracking-wider">Projected ROI</span>
                        </div>
                    </div>
                </section>

                {/* Problem vs Solution Comparison */}
                <section className="w-full max-w-7xl px-6 py-20">
                    <div className="flex flex-col gap-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-display">Systemic Risk vs. Dwellingly Solution</h2>
                        <p className="text-text-secondary max-w-2xl text-lg">The post-NAR settlement landscape exposes agents to unprecedented income volatility. Compare the old verbal agreements with our guaranteed infrastructure.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Risk Card */}
                        <div className="relative group rounded-2xl p-[1px] bg-gradient-to-b from-red-500/20 to-transparent">
                            <div className="bg-[#141414] h-full rounded-2xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-9xl">warning</span>
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                        <span className="material-symbols-outlined">error</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">The Old Way (Risk)</h3>
                                </div>
                                <ul className="space-y-6">
                                    <li className="flex gap-4 items-start">
                                        <span className="material-symbols-outlined text-red-400 shrink-0 mt-1">close</span>
                                        <div>
                                            <h4 className="text-white font-medium text-lg">Unsecured Commissions</h4>
                                            <p className="text-text-secondary text-sm mt-1">Reliance on verbal trust with no legal recourse if a buyer bypasses you.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <span className="material-symbols-outlined text-red-400 shrink-0 mt-1">close</span>
                                        <div>
                                            <h4 className="text-white font-medium text-lg">Income Volatility</h4>
                                            <p className="text-text-secondary text-sm mt-1">Unpredictable revenue streams dependent on seller concessions.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <span className="material-symbols-outlined text-red-400 shrink-0 mt-1">close</span>
                                        <div>
                                            <h4 className="text-white font-medium text-lg">Compliance Nightmares</h4>
                                            <p className="text-text-secondary text-sm mt-1">Constant fear of antitrust violations and improper disclosures.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Solution Card */}
                        <div className="relative group rounded-2xl p-[1px] bg-gradient-to-b from-primary to-transparent shadow-[0_0_40px_-10px_rgba(48,136,117,0.3)]">
                            <div className="bg-[#141e1c] h-full rounded-2xl p-8 relative overflow-hidden backdrop-blur-xl">
                                <div className="absolute top-0 right-0 p-4 opacity-10 text-primary">
                                    <span className="material-symbols-outlined text-9xl">verified_user</span>
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Dwellingly Infrastructure</h3>
                                </div>
                                <ul className="space-y-6">
                                    <li className="flex gap-4 items-start">
                                        <span className="material-symbols-outlined text-primary shrink-0 mt-1">check</span>
                                        <div>
                                            <h4 className="text-white font-medium text-lg">Guaranteed Payouts</h4>
                                            <p className="text-text-secondary text-sm mt-1">Smart contracts lock in your commission before you show the first home.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <span className="material-symbols-outlined text-primary shrink-0 mt-1">check</span>
                                        <div>
                                            <h4 className="text-white font-medium text-lg">Digital Buyer Agreements</h4>
                                            <p className="text-text-secondary text-sm mt-1">One-click, legally binding agreements compliant with new NAR rules.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <span className="material-symbols-outlined text-primary shrink-0 mt-1">check</span>
                                        <div>
                                            <h4 className="text-white font-medium text-lg">Professional Standard</h4>
                                            <p className="text-text-secondary text-sm mt-1">Elevate your practice with institutional-grade financial infrastructure.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ROI Calculator Section */}
                <section className="w-full max-w-7xl px-6 py-20">
                    <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden border border-primary/20">
                        {/* Background decorative element */}
                        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-8 w-full">
                                <div className="space-y-2">
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 mb-2">Calculator</div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white font-display">Project Your Protected Revenue</h2>
                                    <p className="text-text-secondary">Adjust the sliders to see how much income Dwellingly infrastructure protects annually.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm font-medium font-sans">
                                            <span className="text-white">Annual Deal Volume</span>
                                            <span className="text-primary font-bold">{dealVolume} Deals</span>
                                        </div>
                                        <input
                                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                            max="100"
                                            min="1"
                                            type="range"
                                            value={dealVolume}
                                            aria-label="Annual Deal Volume"
                                            onChange={(e) => setDealVolume(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm font-medium font-sans">
                                            <span className="text-white">Avg. Home Price</span>
                                            <span className="text-primary font-bold">${homePrice.toLocaleString()}</span>
                                        </div>
                                        <input
                                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                            max="2000000"
                                            min="100000"
                                            step="50000"
                                            type="range"
                                            value={homePrice}
                                            aria-label="Average Home Price"
                                            onChange={(e) => setHomePrice(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-xl pointer-events-none"></div>
                                    <div className="space-y-1">
                                        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider font-sans">Total Commission Protected</p>
                                        <p className="text-5xl md:text-6xl font-bold text-white tracking-tight font-display">${protectedRevenue.toLocaleString()}</p>
                                    </div>
                                    <div className="w-full h-px bg-white/10"></div>
                                    <div className="flex justify-between w-full px-4">
                                        <div className="text-center font-sans">
                                            <p className="text-text-secondary text-xs mb-1">Risk Reduction</p>
                                            <p className="text-emerald-400 font-bold text-xl flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-sm">trending_up</span> 98%
                                            </p>
                                        </div>
                                        <div className="text-center font-sans">
                                            <p className="text-text-secondary text-xs mb-1">Platform ROI</p>
                                            <p className="text-primary font-bold text-xl">300x</p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                                        Lock in These Rates
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="w-full max-w-7xl px-6 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4 font-display">Trusted by Pilot Agents</h2>
                        <p className="text-text-secondary">See why top producers in Texas are switching to infrastructure-backed agreements.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Testimonial 1 */}
                        <div className="glass-panel p-8 rounded-xl relative group hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute -top-4 -left-4 bg-primary rounded-full p-2 text-white shadow-lg">
                                <span className="material-symbols-outlined text-[24px]">format_quote</span>
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">"The peace of mind is worth every penny. I no longer worry if a buyer will ghost me after months of work. The digital agreement is seamless."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 p-2 flex items-center justify-center text-white">SM</div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Sarah M.</h4>
                                    <p className="text-primary text-xs">Broker Associate, Austin</p>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="glass-panel p-8 rounded-xl relative group hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute -top-4 -left-4 bg-primary rounded-full p-2 text-white shadow-lg">
                                <span className="material-symbols-outlined text-[24px]">format_quote</span>
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">"Clients actually appreciate the professionalism. It shows I treat my business seriously. Dwellingly made the awkward conversation about fees disappear."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 p-2 flex items-center justify-center text-white">JR</div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">James R.</h4>
                                    <p className="text-primary text-xs">Realtor®, Dallas</p>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial 3 */}
                        <div className="glass-panel p-8 rounded-xl relative group hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute -top-4 -left-4 bg-primary rounded-full p-2 text-white shadow-lg">
                                <span className="material-symbols-outlined text-[24px]">format_quote</span>
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">"This is the future. Verbal agreements are dead. If you aren't using infrastructure to secure your commission, you're working for free."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 p-2 flex items-center justify-center text-white">EG</div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Elena G.</h4>
                                    <p className="text-primary text-xs">Team Lead, Houston</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="w-full max-w-5xl px-6 py-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/20 -z-10 group-hover:bg-primary/30 transition-colors duration-500 rounded-3xl"></div>
                    <div className="relative overflow-hidden rounded-3xl bg-primary p-12 md:p-20">
                        {/* Decorative background pattern */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-dots"></div>
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display">Ready to Secure Your Future?</h2>
                            <p className="text-white/80 text-lg max-w-2xl font-sans">Join the exclusive pilot program and be among the first agents to operate with guaranteed commission infrastructure.</p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                                <button className="bg-white text-primary hover:bg-gray-100 text-lg font-bold px-8 py-4 rounded-xl transition-all shadow-lg min-w-[200px]">
                                    Apply for Pilot
                                </button>
                                <button className="bg-black/20 hover:bg-black/30 text-white border border-white/20 text-lg font-bold px-8 py-4 rounded-xl transition-all min-w-[200px]">
                                    Talk to Sales
                                </button>
                            </div>
                            <p className="text-white/60 text-sm mt-4 font-sans">Limited spots available for Q3 2024</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full border-t border-glass-border bg-[#050505] py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-2 items-center md:items-start">
                        <div className="flex items-center gap-2 text-white">
                            <span className="material-symbols-outlined">shield_lock</span>
                            <span className="font-bold text-xl font-display">Dwellingly</span>
                        </div>
                        <p className="text-text-secondary text-sm">Commission Infrastructure for the Modern Agent.</p>
                    </div>
                    <div className="flex gap-8 flex-wrap justify-center font-sans">
                        <a className="text-text-secondary hover:text-white text-sm transition-colors" href="#">Privacy Policy</a>
                        <a className="text-text-secondary hover:text-white text-sm transition-colors" href="#">Terms of Service</a>
                        <a className="text-text-secondary hover:text-white text-sm transition-colors" href="#">Contact Support</a>
                    </div>
                    <div className="flex gap-4">
                        <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors" href="#" aria-label="Twitter">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                        </a>
                        <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors" href="#" aria-label="GitHub">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path></svg>
                        </a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-white/5 text-center md:text-left">
                    <p className="text-xs text-text-secondary/50">© 2024 Dwellingly Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
