import fs from 'fs';
import { Parser } from 'json2csv';

export function saveToCSV(data, filename) {
    const fields = ['titulo', 'resumen', 'autor', 'fecha', 'imagen', 'enlace'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    fs.writeFileSync(`./data/${filename}.csv`, csv, 'utf-8');
}