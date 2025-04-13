// hooks/usePlantUML.ts
import plantumlEncoder from 'plantuml-encoder';

export function usePlantUML(uml: string) {
    const encoded = plantumlEncoder.encode(uml);

    const getImageUrl = (format: 'svg' | 'png' = 'svg') => {
        return `https://www.plantuml.com/plantuml/${format}/${encoded}`;
    };

    const checkSyntax = async (): Promise<{ valid: boolean; message?: string }> => {
        try {
            const url = getImageUrl('svg');
            const res = await fetch(url);

            if (!res.ok) {
                return { valid: false, message: `HTTP ${res.status}: ${res.statusText}` };
            }

            const text = await res.text();
            if (text.includes('Syntax Error') || text.includes('plantuml.syntax')) {
                return { valid: false, message: 'Syntax error detected in PlantUML code' };
            }

            return { valid: true };
        } catch (error: any) {
            return { valid: false, message: error.message || 'Unknown error' };
        }
    };

    const downloadDiagram = async (format: 'svg' | 'png' = 'svg', filename = 'diagram') => {
        const url = getImageUrl(format);
        const res = await fetch(url);
        const blob = await res.blob();

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${filename}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return {
        getImageUrl,
        downloadDiagram,
        checkSyntax
    };
}
