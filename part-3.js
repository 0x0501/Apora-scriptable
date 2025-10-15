/**
 * @license GNU General Public License v3.0
 * @description A Scriptable script to use Apora on iOS/iPad devices.
 * @link https://github.com/0x0501/Apora-scriptable
 * @author: 0x0501
 */

const input = args.shortcutParameter;

const config = JSON.parse(input.config);
const fullText = input.fullText;
const inquire = input.inquire;
const data = JSON.parse(input.data);

/**
 * Parse anki fields and encode them.
 *
 * @param {Record<string, string>} fields
 * @returns `string`
 */
function parseFields(fields) {
	const fields_pair = Object.getOwnPropertyNames(fields).map((v) => {
		return `fld${v}=${encodeURIComponent(fields[v])}`;
	});

	let s = "";

	for (let i = 0; i < fields_pair.length; i++) {
		s += fields_pair[i] + (i < fields_pair.length - 1 ? "&" : "");
	}
	return s;
}

/**
 * Colorize fullText with custom color
 *
 * @param {string} fullText
 * @param {string} selected
 * @returns colorized `string`
 */
function colorizeFullText(fullText, selected) {
	return fullText.replace(
		selected,
		`<span style="font-weight: bold; color: ${config.apora_colorize_color_hex};">${selected}</span>`,
	);
}

const AUDIO_GATEWAY = "https://apora.sumku.cc/api/dict";

const fields = {
	Sentence: config.colorize ? colorizeFullText(fullText, inquire) : fullText,
	Phonetics: data.ipa,
	Word: data.original,
	Definition: data.meaning,
	Chinese_Definition: data.chineseMeaning,
	...(config.tts_words || config.tts_sentence
		? {
				Pronunciation: `${AUDIO_GATEWAY}/${config.token}/${data.fileNameTag}.wav`,
			}
		: {}),
};

const flatten_fields = parseFields(fields);

const meta_schema = `anki://x-callback-url/addnote?profile=${config.profile}&type=${config.note_type}&deck=${config.deck_name}&tags=${data.partOfSpeech} Apora`;

const data_schema = `&${flatten_fields}`;

const encoded_meta_schema = encodeURI(meta_schema);

const final_schema = encoded_meta_schema + data_schema;

Script.setShortcutOutput({
	success: true,
	message: null,
	data: final_schema,
});

Script.complete();
