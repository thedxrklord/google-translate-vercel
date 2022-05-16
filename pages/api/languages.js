import {Languages} from "../../services/Translate";

export default async function handler(req, res) {
    res.status(200).json({languages: Languages()});
}