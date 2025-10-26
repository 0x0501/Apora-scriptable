/**
 * @license GNU General Public License v3.0
 * @description A Scriptable script to use Apora on iOS/iPad devices.
 * @link https://github.com/0x0501/Apora-scriptable
 * @author: 0x0501
 */

/**
 * @type {string[]}
 */
const input = args.shortcutParameter.split(" ");

const remove_specials = input
	.map((i) => i.replace(/[.,?"]+/gi, ""))
	.filter((i) => i !== "");

Script.setShortcutOutput(remove_specials.join(" "));
Script.complete();
