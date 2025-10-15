/**
 * @license GNU General Public License v3.0
 * @description A Scriptable script to use Apora on iOS/iPad devices.
 * @link https://github.com/0x0501/Apora-scriptable
 * @author: 0x0501
 */

const input = args.shortcutParameter;

if (input.tts_words && input.tts_sentence) {
	Script.setShortcutOutput(true);
} else {
	Script.setShortcutOutput(false);
}

Script.complete();
