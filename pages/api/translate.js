import {Translate} from "../../services/Translate";
import {Languages} from "../../services/Translate";

export default async function handler(req, res) {
    const languageFrom = req.body.from;
    const languageTo = req.body.to;
    const text = req.body.text;

    let languages = Languages();

    if (languageFrom === languageTo) {
        return res.status(400).json({'success': false, 'error': `Language from can't be same to language to`});
    }

    if (!languages.includes(languageFrom)) {
        return res.status(400).json({'success': false, 'error': `Unknown language from`});
    }

    if (!languages.includes(languageTo) && languageTo === 'auto') {
        return res.status(400).json({'success': false, 'error': `Unknown language to`});
    }

    let result = await Translate(text, languageFrom, languageTo)
    return res.status(200).json({'success': true, text: result, from: languageFrom, to: languageTo});
}