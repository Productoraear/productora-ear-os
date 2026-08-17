
import React, { useState } from 'react';
import { UserRole, Persona, AllAnalysisResults } from '../../types';
import { ConvocationView } from './ConvocationView';
import { AdvisorSelectionView } from './AdvisorSelectionView';
import { DeliberationView } from './DeliberationView';
import { SynthesisView } from './SynthesisView';
import { AnimatePresence, motion } from 'framer-motion';

interface StrategicCouncilContainerProps {
    userRole: UserRole;
    onComplete: () => void; // To go back to the toolkit hub
}

type CouncilStep = 'CONVOCATION' | 'SELECTION' | 'DELIBERATION' | 'SYNTHESIS';

export const StrategicCouncilContainer: React.FC<StrategicCouncilContainerProps> = ({ userRole, onComplete }) => {
    const [step, setStep] = useState<CouncilStep>('CONVOCATION');
    const [dilemma, setDilemma] = useState('');
    const [context, setContext] = useState('');
    const [selectedAdvisors, setSelectedAdvisors] = useState<Persona[]>([]);
    const [deliberationResults, setDeliberationResults] = useState<AllAnalysisResults>({});

    const handleConvocationNext = (d: string, c: string) => {
        setDilemma(d);
        setContext(c);
        setStep('SELECTION');
    };

    const handleSelectionNext = (advisors: Persona[]) => {
        setSelectedAdvisors(advisors);
        setStep('DELIBERATION');
    };

    const handleSelectionBack = () => {
        setStep('CONVOCATION');
    };

    const handleDeliberationComplete = (results: AllAnalysisResults) => {
        setDeliberationResults(results);
        setStep('SYNTHESIS');
    };

    const handleSynthesisComplete = () => {
        onComplete();
    };

    const renderStep = () => {
        switch (step) {
            case 'CONVOCATION':
                return <ConvocationView onNext={handleConvocationNext} initialDilemma={dilemma} initialContext={context} />;
            case 'SELECTION':
                return <AdvisorSelectionView userRole={userRole} onNext={handleSelectionNext} onBack={handleSelectionBack} />;
            case 'DELIBERATION':
                return <DeliberationView dilemma={dilemma} context={context} advisors={selectedAdvisors} onComplete={handleDeliberationComplete} userRole={userRole} />;
            case 'SYNTHESIS':
                return <SynthesisView dilemma={dilemma} context={context} results={deliberationResults} onComplete={handleSynthesisComplete} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-zinc-950">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full h-full flex flex-col"
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
