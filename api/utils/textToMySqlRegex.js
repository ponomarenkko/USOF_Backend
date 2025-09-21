function toWords(text) {
	let words = [
		...new Set(
			text
				.trim()
				// .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, "")
				.split(/[\s]+/),
		),
	];

	return words;
}

function textToRegexStrict(text) {
	const words = toWords(text);

	return `(.*` + words.join(`.*`) + `.*)`;
}

function textToRegexSoft(text) {
	const words = toWords(text);

	return `(` + words.join(`|`) + `)`;
}

const textToMySqlRegex = {
	strict: textToRegexStrict,
	soft: textToRegexSoft,
};

export default textToMySqlRegex;
