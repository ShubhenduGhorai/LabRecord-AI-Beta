import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const pdfService = {
    /**
     * Generates a PDF lab report buffer from experiment data.
     */
    async generateLabReportPdf(experimentData: any): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]); // Custom width & height
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        let yOffset = 750;
        const margin = 50;
        const maxWidth = 500;
        const fontSize = 12;

        const drawTextWrapped = (text: string, currentY: number, currentFont: any = font, currentFontSize: number = fontSize) => {
            const words = text.split(' ');
            let line = '';
            let y = currentY;

            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const textWidth = currentFont.widthOfTextAtSize(testLine, currentFontSize);

                if (textWidth > maxWidth && i > 0) {
                    page.drawText(line, { x: margin, y, size: currentFontSize, font: currentFont });
                    line = words[i] + ' ';
                    y -= (currentFontSize + 4);
                } else {
                    line = testLine;
                }

                if (y < margin) {
                    // Simplistic pagination check (not full multi-page support in this basic version)
                    return yOffset;
                }
            }

            page.drawText(line, { x: margin, y, size: currentFontSize, font: currentFont });
            return y - (currentFontSize + 4);
        };

        // Title
        yOffset = drawTextWrapped(experimentData.title || 'Lab Report', yOffset, boldFont, 18);
        yOffset -= 20;

        const sections = [
            { heading: 'Aim', content: experimentData.aim },
            { heading: 'Apparatus', content: experimentData.apparatus },
            { heading: 'Theory', content: experimentData.theory },
            { heading: 'Procedure', content: experimentData.procedure },
            { heading: 'Result', content: experimentData.result },
            { heading: 'Precautions', content: experimentData.precautions },
            { heading: 'Conclusion', content: experimentData.conclusion }
        ];

        for (const section of sections) {
            if (section.content) {
                yOffset = drawTextWrapped(section.heading, yOffset, boldFont, 14);
                yOffset -= 5;
                yOffset = drawTextWrapped(section.content, yOffset, font, 12);
                yOffset -= 15;
            }
        }

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    }
};
