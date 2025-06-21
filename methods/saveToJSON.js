import fs from 'fs';

export function saveToJSON(data, filename) {
    fs.writeFileSync(`./data/${filename}.json`, JSON.stringify(data, null, 2), 'utf-8');
}