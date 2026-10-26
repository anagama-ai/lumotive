// Short function words that stay lowercase inside a title; anything four
// letters or longer is capitalised, as in AP style.
const MINOR: Record<string, true> = {
	a: true,
	an: true,
	and: true,
	as: true,
	at: true,
	but: true,
	by: true,
	for: true,
	in: true,
	nor: true,
	of: true,
	on: true,
	or: true,
	per: true,
	the: true,
	to: true,
	up: true,
	via: true,
	vs: true
};

// Brand names the naming conventions fix in lower case. Page 01 of the approved
// content package spells "onsemi" lower case everywhere, headings included, so
// headline capitalisation must leave it alone.
const LOWERCASE: Record<string, true> = {
	onsemi: true
};

// A word carrying a capital of its own is the author's: LM10, iToF, AGV/AMR and
// LCM™ are left exactly as written.
const capitalise = (word: string) =>
	LOWERCASE[word.replace(/[^\p{L}]/gu, '').toLowerCase()]
		? word
		: word
				.split('-')
				.map((part) =>
					/\p{Lu}/u.test(part)
						? part
						: part.replace(/^([^\p{L}]*)(\p{Ll})/u, (_, lead, letter) => lead + letter.toUpperCase())
				)
				.join('-');

/** Headline capitalisation: every word but the minor ones, which keep their place. */
export function titleCase(input?: string | null): string | null {
	if (input == null) return null;
	if (!input) return input;
	const parts = input.split(/(\s+)/);
	const last = parts.reduce((found, part, index) => (part.trim() ? index : found), 0);

	return parts
		.map((part, index) => {
			if (!part.trim()) return part;
			const opensSentence = index === 0 || /[.:!?—]$/.test(parts[index - 2] ?? '');
			if (opensSentence || index === last) return capitalise(part);
			const bare = part.replace(/[^\p{L}]/gu, '').toLowerCase();
			return MINOR[bare] ? part : capitalise(part);
		})
		.join('');
}
