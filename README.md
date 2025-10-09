# `Apora-scriptable`

Apora scriptable integration. This project make Apora easy to use on iOS/iPad with [Scriptable](https://scriptable.app/) and Shortcuts.

## Installment

1. Download Scriptable from Apple Store.
2. Create a empty scriptable file.
3. Copy all the content in `index.js` and paste it in the file you've just created.
4. Follow the comments in the `index.js`, configure Anki and Apora.

## Configuration

- `anki_profile`: Your anki profile name。 Open Anki iOS, in settings, you will ee your profiles.
- `anki_deck_name`: Your anki deck name, this is case-sensitive.
- `anki_note_type`: Your anki note type. The note type must match the fields in `index.js`, if you don't know what it is, leave it alone. (By default, it use `Apora-English`)
- `apora_base_url`: Do not alter this line, or you code won't work.
- `apora_api_token`: Apora API Token, get your token at [https://apora.sumku.cc](https://apora.sumku.cc)
- `apora_colorize`: Whether to colorize the inquired word/phrase in full-text.
- `apora_colorize_color_hex`: The color of the emphasizing word/phrase, for eｘample:"#4096ff"．

## License

GNU General Public License v3.0
