/**
 * @license GNU General Public License v3.0
 * @description A Scriptable script to use Apora on iOS/iPad devices.
 * @link https://github.com/0x0501/Apora-scriptable
 * @author: 0x0501
 */

const input = args.shortcutParameter;

const config = {
	anki_profile: "YOUR_ANKI_PROFILE_NAME", // <---- modify this line
	anki_deck_name: "YOUR_ANKI_DECK_NAME", // <---- modify this line
	anki_note_type: "ENG-Omni",
	apora_base_url: "https://apora.sumku.cc/api/dict",
	apora_api_token: "YOUR_APORA_API_TOKEN", // <---- modify this line, get your token at https://apora.sumku.cc
	apora_colorize: true,
	apora_colorize_color_hex: "#4096ff",
};

if (input === null) {
	const alert = new Alert();
	alert.title = "Apora Error";
	alert.message = "Apora can only invoke from Shortcuts.";

	Script.complete();
}

const inquire = input.inquire;
const fullText = input.fullText;

// Sent request to Apora
const request = new Request(config.apora_base_url);
request.method = "POST";
request.headers = {
	Authorization: `Bearer ${config.apora_api_token}`,
};
request.body = JSON.stringify({
	inquire: inquire,
	fullText: fullText,
});

const res = await request.loadJSON();

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

if (res.success && res.data) {
	const fields = {
		Sentence: config.apora_colorize
			? colorizeFullText(fullText, inquire)
			: fullText,
		Phonetics: res.data.ipa,
		Word: res.data.original,
		Definition: res.data.meaning,
		Extra: res.data.chineseMeaning,
	};

	const flatten_fields = parseFields(fields);

	const meta_schema = `anki://x-callback-url/addnote?profile=${config.anki_profile}&type=${config.anki_note_type}&deck=${config.anki_deck_name}&tags=${res.data.partOfSpeech} Apora`;

	const data_schema = `&${flatten_fields}`;

	const encoded_meta_schema = encodeURI(meta_schema);

	const final_schema = encoded_meta_schema + data_schema;

	Script.setShortcutOutput({
		success: true,
		message: null,
		data: final_schema,
	});
} else {
	// return error message to shortcuts
	Script.setShortcutOutput({
		success: false,
		message: res.error,
		data: null,
	});
}

Script.complete();
