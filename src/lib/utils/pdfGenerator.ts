export const generatePDFFromElement = async (elementId: string, filename: string) => {
    try {
        // Dynamic imports to keep initial bundle size small
        const html2canvas = (await import('html2canvas')).default;
        const { jsPDF } = await import('jspdf');

        const element = document.getElementById(elementId);
        if (!element) throw new Error(`Element ${elementId} not found`);

        // Add a temporary class to ensure it renders correctly for the canvas
        element.classList.add('pdf-render-mode');

        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            useCORS: true,
            logging: false,
            windowWidth: 800, // Fixed width for consistent rendering
        });

        element.classList.remove('pdf-render-mode');

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'letter'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);

    } catch (err) {
        console.error('Failed to generate PDF:', err);
        throw err;
    }
};
