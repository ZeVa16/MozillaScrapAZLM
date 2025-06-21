import fs from 'fs';
import PDFDocument from 'pdfkit';

export function saveToPDF(data, filename) {
    const pdf = new PDFDocument();
    pdf.pipe(fs.createWriteStream(`./data/${filename}.pdf`));

    data.forEach((a, i) => {
        pdf.fontSize(14).text(`Artículo ${i + 1}`, { underline: true });
        pdf.fontSize(12).text(`Título: ${a.titulo}`);
        pdf.text(`Resumen: ${a.resumen}`);
        pdf.text(`Autor: ${a.autor}`);
        pdf.text(`Fecha: ${a.fecha}`);
        pdf.text(`Imagen: ${a.imagen}`);
        pdf.text(`Enlace: ${a.enlace}`);
        pdf.moveDown(1);
        pdf.text('----------------------------------------');
        pdf.moveDown(1);
    });

    pdf.end();
}