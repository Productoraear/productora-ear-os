

// FIX: Corrected import path
import { AnalysisParameters, AllAnalysisResults, SynthesisResult, Persona, PersonaAnalysis } from '../types';

const formatAnalysisToMarkdown = (
    params: AnalysisParameters,
    results: AllAnalysisResults,
    synthesis: SynthesisResult | null
): string => {
    let md = `# Strategic Analysis Report\n\n`;

    md += `## 1. Decision Parameters\n\n`;
    md += `**Dilemma:** ${params.problem}\n\n`;
    md += `**Decision Type:** ${params.decisionType}\n`;
    md += `**Risk Appetite:** ${params.riskAppetite}\n`;
    md += `**Time Horizon:** ${params.horizon}\n`;
    
    md += `### Desired Outcomes:\n`;
    params.desiredOutcomes.forEach(o => md += `- ${o}\n`);
    md += `\n`;

    md += `### Personas Consulted:\n`;
    params.personas.forEach(p => md += `- ${p}\n`);
    md += `\n---\n\n`;

    if (synthesis) {
        md += `## 2. Executive Synthesis\n\n`;
        md += `### Summary\n${synthesis.executiveSummary}\n\n`;
        md += `### Strategic Recommendation\n`;
        md += `**Strategy:** ${synthesis.strategicRecommendation.strategy}\n`;
        md += `**Justification:** ${synthesis.strategicRecommendation.justification}\n`;
        md += `**Confidence:** ${synthesis.strategicRecommendation.confidence}/10\n\n`;
        md += `### Potential Risks & Mitigations\n`;
        synthesis.risks.forEach(r => {
            md += `- **Risk:** ${r.risk} (Severity: ${r.severity}/10)\n`;
            md += `  - **Mitigation:** ${r.mitigation}\n`;
        });
        md += `\n---\n\n`;
    }

    md += `## 3. Individual Advisor Analyses\n\n`;

    for (const persona in results) {
        const analysis = results[persona as Persona] as PersonaAnalysis;
        if (analysis) {
            md += `### Analysis from: ${persona.replace(/_/g, ' ')}\n\n`;
            if (analysis.error) {
                md += `**Error during analysis:** ${analysis.error}\n\n`;
                continue;
            }
            
            md += `**Core Analysis:**\n${analysis.analysisResult}\n\n`;

            if(analysis.scenarios.length > 0) {
                md += `**Recommended Strategies:**\n\n`;
                analysis.scenarios.forEach((scenario, index) => {
                    md += `#### Strategy ${index + 1}: ${scenario.strategy}\n`;
                    md += `- **Potential Impact:** ${scenario.potentialImpact}/10\n`;
                    md += `- **Confidence Score:** ${scenario.confidenceScore}/10\n`;
                    md += `- **Pros:**\n`;
                    scenario.pros.forEach(p => md += `  - ${p}\n`);
                    md += `- **Cons:**\n`;
                    scenario.cons.forEach(c => md += `  - ${c}\n`);
                    md += `\n`;
                });
            }

            if(analysis.sources && analysis.sources.length > 0) {
                md += `**Sources:**\n`;
                analysis.sources.forEach(s => {
                    md += `- [${s.web.title || s.web.uri}](${s.web.uri})\n`;
                });
                md += `\n`;
            }
             md += `\n---\n\n`;
        }
    }

    return md;
};

export const exportAnalysis = (
    params: AnalysisParameters,
    results: AllAnalysisResults,
    synthesis: SynthesisResult | null
) => {
    const markdownContent = formatAnalysisToMarkdown(params, results, synthesis);
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `Astra_Analysis_${new Date().toISOString().split('T')[0]}.md`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};