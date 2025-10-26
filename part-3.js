/**
 * @license GNU General Public License v3.0
 * @description A Scriptable script to use Apora on iOS/iPad devices.
 * @link https://github.com/0x0501/Apora-scriptable
 * @author: 0x0501
 */

const input = args.shortcutParameter;

/**
 * @typedef {Object} ConfigType
 * @property {string} profile - Anki's Profile name
 * @property {string} deck_name - Anki's deck name
 * @property {string} note_type - Anki's note type
 * @property {string} token - Apora API Token
 * @property {boolean} colorize - Enable colorize inquiring term in context (full-text).
 * @property {string} color_hex - Color hex which used to highlight term in the context (full-text).
 * @property {boolean} debug - Enable `debug` mode
 * @property {boolean} tts_words - Enable TTS for inquiring term/phrases.
 * @property {boolean} tts_sentence - Enable TTS for full-text or context.
 * @property {boolean} context - Enable Context feature.
 * @property {"US" | "GB"} variant - Pronunciation variant, effect IPA and speaking.
 */

/**
 *
 * @typedef {Object} DataType
 * @property {string} partOfSpeech
 * @property {string} original
 * @property {string} meaning
 * @property {string} chineseMeaning
 * @property {"US" | "GB"} pronunciationVariant
 * @property {string} ipa
 * @property {string} [context] - Context for the inquiring term, if `context` feature is enabled
 * @property {string} [replacing] - A special field for replacing term in context, no matter which form the term turned into, we can always look it up by searching `replacing` in context field. This will only present when context enabled.
 * @property {string} [fileNameTag] - Audio filename tag, if `speech` feature is enabled
 */

/** @type {ConfigType} */
const config = JSON.parse(input.config);

/**@type {string | null} - User provided full-text */
const fullText = input.fullText;

/**@type {string} - User inquiring term */
const inquire = input.inquire;

/** @type {DataType} - Response data retrieved from server */
const data = JSON.parse(input.data);

/**
 * Parse anki fields and encode them.
 *
 * @param {Record<string, string>} fields
 * @returns `string`
 */
function parseFields(fields) {
	const fields_pair = Object.getOwnPropertyNames(fields).map((v) => {
		// @ts-expect-error This is safe, trust me.
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
		`<span style="font-weight: bold; color: ${config.color_hex};">${selected}</span>`,
	);
}

const AUDIO_GATEWAY = "https://apora.sumku.cc/api/dict";

let sanitizedFullText = "";

if (fullText && fullText.length > 0) {
	sanitizedFullText = fullText;
} else if (data.context) {
	sanitizedFullText = data.context;
} else {
	sanitizedFullText = inquire; // This is fallback for server error.
}

let searchTerm = "";

if (config.context) {
	if (data.replacing) {
		searchTerm = data.replacing;
	} else {
		searchTerm = inquire;
	}
} else {
	searchTerm = inquire;
}

const fields = {
	Sentence: config.colorize
		? colorizeFullText(sanitizedFullText, searchTerm) // if `context` feature enabled, we may search original form instead of inquiring term.
		: sanitizedFullText,
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
