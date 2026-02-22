import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Props {
    onNext: () => void;
    summarySections?: { title: string; content: string }[];
}

const StepSummary: React.FC<Props> = ({ onNext, summarySections }) => {
    // Use fallbacks if not provided
    const sections = summarySections || [
        { title: 'Exclusive Representation', content: 'You agree to work exclusively with this agent for the duration of the agreement.' },
        { title: 'Broker Compensation', content: 'The brokerage fee is negotiated upfront. If the seller offers compensation, it credits against this amount.' },
        { title: 'Term & Termination', content: 'The agreement has a set duration but can typically be terminated by either party with written notice.' }
    ];

    return (
        <div className="p-8 animate-in slide-in-from-right-2 duration-300">
            <div className="flex items-center gap-3 mb-6 bg-violet-50 text-violet-700 px-4 py-2 rounded-full w-fit border border-violet-100">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Plain Language Summary</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Understanding the Terms</h2>

            <div className="space-y-6 mb-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-100 before:via-brand-200 before:to-brand-50">
                {sections.map((section, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 z-10">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-brand-500 text-white shadow-sm shrink-0 font-bold text-xs">
                            {idx + 1}
                        </div>
                        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm w-full">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{section.title}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{section.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onNext}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group"
            >
                I Understand, Proceed to Sign <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default StepSummary;
