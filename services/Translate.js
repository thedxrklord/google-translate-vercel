import puppeteer from "puppeteer-core";
import chromium from 'chrome-aws-lambda';

export async function Translate(text, languageFrom, languageTo) {
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    })
    const languageSelector = `[data-language="${languageTo}"]`;
    const textAreaSelector = `textarea`

    let result = null;

    try {
        // Open translator and wait till it loads
        const page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto(`https://translate.google.com/?sl=${languageFrom}&tl=${languageTo}&op=translate`);
        await page.waitForSelector(textAreaSelector, {visible: true});
        await page.evaluate(async (text) => {
            let textarea = document.getElementsByTagName('textarea')[0];
            textarea.innerHTML = text.replace(/\r/g, "\r").replace(/\n/g, "\n");
        }, text)

        await page.keyboard.press('Enter');

        await page.waitForSelector(languageSelector, {visible: true});

        // Get result
        result = await page.evaluate((languageSelector) => {
            return document.querySelector(languageSelector).firstElementChild.innerText;
        }, languageSelector);
    } catch (e) {
        console.log(e)
    } finally {
        await browser.close();
    }

    return result;
}

export function Languages() {
    return [
        'auto', 'af', 'sq', 'am', 'ar',
        'hy', 'az', 'eu', 'be', 'bn',
        'bs', 'bg', 'ca', 'ceb', 'ny',
        'zh-cn,e Simplified', 'zh-tw,e Traditional',
        'co', 'hr', 'cs', 'da', 'nl',
        'en', 'eo', 'et', 'tl', 'fi',
        'fr', 'fy', 'gl', 'ka', 'de',
        'el', 'gu', 'ht', 'ha', 'haw',
        'iw', 'hi', 'hmn', 'hu', 'is',
        'ig', 'id', 'ga', 'it', 'ja',
        'jw', 'kn', 'kk', 'km', 'ko',
        'ku', 'ky', 'lo', 'la', 'lv',
        'lt', 'lb', 'mk', 'mg', 'ms',
        'ml', 'mt', 'mi', 'mr', 'mn',
        'my', 'ne', 'no', 'ps', 'fa',
        'pl', 'pt', 'ma', 'ro', 'ru',
        'sm', 'gd', 'sr', 'st', 'sn',
        'sd', 'si', 'sk', 'sl', 'so',
        'es', 'su', 'sw', 'sv', 'tg',
        'ta', 'te', 'th', 'tr', 'uk',
        'ur', 'uz', 'vi', 'cy', 'xh',
        'yi', 'yo', 'zu'
    ];
}