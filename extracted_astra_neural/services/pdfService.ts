
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadElementAsPDF = async (elementId: string, filename: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`PDF Export Error: Element with id #${elementId} not found.`);
    return;
  }
  
  // Store original styles
  const originalOverflow = input.style.overflow;
  const originalHeight = input.style.height;
  const originalMaxHeight = input.style.maxHeight;
  const originalPosition = input.style.position;

  try {
    // Expand element to full height to capture everything
    input.style.overflow = 'visible';
    input.style.height = 'auto';
    input.style.maxHeight = 'none';
    // Ensure it doesn't float on top of everything during capture if fixed
    // input.style.position = 'relative'; 

    const canvas = await html2canvas(input, { 
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false, 
        backgroundColor: '#09090b', // Force dark background match (zinc-950)
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight + 100, // Add buffer
        x: 0,
        y: 0
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Standard A4 page size in points (pt)
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });
    
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate the image's aspect ratio to fit into the PDF page
    const imgAspectRatio = imgWidth / imgHeight;
    const pdfImgWidth = pdfPageWidth - 40; // with 20pt margin on each side
    const pdfImgHeight = pdfImgWidth / imgAspectRatio;
    
    let heightLeft = pdfImgHeight;
    let position = 20; // Top margin

    // Add the first page
    pdf.addImage(imgData, 'PNG', 20, position, pdfImgWidth, pdfImgHeight);
    heightLeft -= (pdfPageHeight - 40);

    // Add new pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - pdfImgHeight; // Move image up
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, position + 20, pdfImgWidth, pdfImgHeight);
      heightLeft -= (pdfPageHeight - 40);
    }
    
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Restore original styles
    input.style.overflow = originalOverflow;
    input.style.height = originalHeight;
    input.style.maxHeight = originalMaxHeight;
    input.style.position = originalPosition;
  }
};