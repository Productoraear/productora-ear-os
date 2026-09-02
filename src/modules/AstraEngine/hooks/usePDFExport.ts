import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const usePDFExport = () => {
    const [isExporting, setIsExporting] = useState(false);

    const exportToPDF = useCallback(async (elementId: string, filename: string) => {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`PDF Export: Element with id ${elementId} not found`);
            return;
        }

        setIsExporting(true);

        try {
            // 1. High quality capture
            const canvas = await html2canvas(element, {
                scale: 2, // Retina resolution
                useCORS: true, // Allow external images
                logging: false,
                backgroundColor: '#020204', // Match theme background
                ignoreElements: (node) => node.classList.contains('no-print') // Ignore elements with 'no-print' class
            });

            // 2. Generate PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 297; // A4 Landscape width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // 3. Professional Metadata
            pdf.setProperties({
                title: filename,
                subject: 'Astra Strategic Report',
                creator: 'Astra OS Neural Engine'
            });

            pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("PDF Export failed", error);
        } finally {
            setIsExporting(false);
        }
    }, []);

    return { exportToPDF, isExporting };
};