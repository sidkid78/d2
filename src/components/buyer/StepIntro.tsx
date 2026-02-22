import React from 'react';
import { ArrowRight, FileCheck, ShieldAlert } from 'lucide-react';

interface Props {
    onNext: () => void;
    agentName: string;
}

const StepIntro: React.FC<Props> = ({ onNext, agentName }) => {
    return (
        <div className="p-8 animate-in slide-in-from-right-2 duration-300">
            <div className="bg-brand-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-brand-100">
                <FileCheck className="text-brand-600 w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Review Your Representation Terms</h2>

            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                <span className="font-bold text-slate-800">{agentName}</span> has shared a digital representation agreement.
                This document ensures transparency and protects both parties during the home buying process.
            </p>

            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 mb-8 flex gap-4">
                <ShieldAlert className="text-amber-500 w-6 h-6 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-amber-900 text-sm">Why am I signing this?</h4>
                    <p className="text-amber-800 text-sm mt-1 leading-relaxed">
                        Recent industry changes require a signed agreement before touring homes.
                        This standardizes expectations and compensation before services begin.
                    </p>
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group hover:-translate-y-0.5 hover:shadow-md"
            >
                Continue to Summary <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default StepIntro;
