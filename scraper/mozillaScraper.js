import puppeteer from 'puppeteer';
import { saveToJSON } from '../methods/saveToJSON.js';
import { saveToCSV } from '../methods/saveToCSV.js';
import { saveToExcel } from '../methods/saveToEXEL.js';
import { saveToTXT } from '../methods/saveToTXT.js';
import { saveToPDF } from '../methods/saveToPDF.js';


const URL = 'https://hacks.mozilla.org/';

export async function scrapeMozilla() {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    console.log('Ingreso a la pagina')
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('li.list-item.row.listing', { timeout: 80000 });

    let articulos = [];
    let haySiguiente = true;
    let contadorPaginas = 0;
    let maxPaginas = 5;
    let urlAnterior = '';

    while (haySiguiente && contadorPaginas < maxPaginas) {
        const nuevosArticulos = await page.evaluate(() => {
            const data = [];
            const elementos = document.querySelectorAll('li.list-item.row.listing');

            elementos.forEach(item => {
                const titulo = item.querySelector('h3 a')?.innerText || "Sin título";
                const resumen = item.querySelector('p')?.innerText || "Sin resumen";
                const enlace = item.querySelector('h3 a')?.href || "";
                const fecha = item.innerText.match(/Posted on\s(.+)/i)?.[1]?.trim() || "Sin fecha";
                const imagen = item.querySelector('img')?.src || "Sin imagen";
                data.push({ titulo, resumen, enlace, fecha, imagen });
            });

            return data;

            contadorPaginas = contadorPaginas +1;

        });

        for (let articulo of nuevosArticulos) {
            try {
                const articlePage = await browser.newPage();
                await articlePage.goto(articulo.enlace, {
                    waitUntil: 'domcontentloaded',
                    timeout: 80000 
                });

                const autor = await articlePage.evaluate(() => {
                    const autorElemento = document.querySelector('.byline .url');
                    return autorElemento ? autorElemento.textContent.trim() : 'Autor no disponible';
                });

                articulo.autor = autor;
                await articlePage.close();
                console.log('Obtuvo autor',autor)
            } catch {
                articulo.autor = 'Autor no disponible';
                console.log("no se pudo obtener")
                
            }
        }

        articulos = articulos.concat(nuevosArticulos);

        const siguiente = await page.$('h3.read-more a') || await page.$('nav.nav-paging a');
        if (siguiente) {
            const urlSiguiente = await page.evaluate(el => el.href, siguiente);
            const urlActual = page.url();

            if (urlSiguiente === urlAnterior || urlSiguiente === urlActual) break;

            urlAnterior = urlActual;

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded',timeout: 60000 }),
                siguiente.click()
            ]);

            await page.waitForSelector('li.list-item.row.listing', { timeout: 60000 });
        } else {
            haySiguiente = false;
        }
    }

    await browser.close();

    saveToJSON(articulos, 'articulos');
    saveToCSV(articulos, 'articulos');
    saveToExcel(articulos, 'articulos');
    saveToTXT(articulos, 'articulos');
    saveToPDF(articulos, 'articulos');
}