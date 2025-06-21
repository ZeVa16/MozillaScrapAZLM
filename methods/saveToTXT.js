import fs from 'fs';

export function saveToTXT(data, filename) {
    let txt = '';
    data.forEach((a, i) => {
        txt += `Artículo ${i + 1}\n`;
        txt += `Título: ${a.titulo}\nResumen: ${a.resumen}\nAutor: ${a.autor}\nFecha: ${a.fecha}\nImagen: ${a.imagen}\nEnlace: ${a.enlace}\n`;
        txt += `-----------------------------\n\n`;
    });
    fs.writeFileSync(`./data/${filename}.txt`, txt, 'utf-8');
}