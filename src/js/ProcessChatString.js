const escapeSampColors = (text) => {
	if (text.length > 0) {
		text = text.replaceAll( /\{([a-fA-F0-9]{6})\}/g ,
			(wholeMatch) =>
			{
				return `{${wholeMatch}}`;
			});
	}

	return text;
}

const removeSampColors = (text) => {
	if (text.length > 0) {
		text = text.replaceAll( /\{([a-fA-F0-9]{6})\}/g ,
			() =>
			{
				return "";
			});
	}

	return text;
}

const replaceNamedColors = (text, palette) => {
	if (text.length > 0) {
		text = text.replaceAll(/\{\$([a-zA-Z0-9_]+)\}/g,
			(wholeMatch, colorInvoc) =>
			{
				const idx = palette.findIndex(c => c.invoc === colorInvoc);
				if (idx === -1)
					return `{$${colorInvoc}}`;

				return `{${palette[idx].value}}`;
			});
	}

	return text;
}

const replaceVariables = (text, variables) => {
	const regex = `\\{\\^([a-zA-Z_]{1}[a-zA-Z0-9_]*)?(\\|([^\\{\\}]*))?\\}`;
	if (text.length > 0) {
		text = text.replaceAll(new RegExp(regex, 'g'),
			(wholeMatch, varName, optFormatter, formatter) =>
			{
				if (varName)
				{
					if (variables) {
						const entries = Object.entries(variables);
						const idx = entries.findIndex(([_, value]) => (value.invoc === varName));
						if (idx !== -1)
						{
							return `${entries[idx].value||""}`;
						}
					}
				}
				return `{${formatter||""}}`;
			});
	}

	return text;
}

export function processChatString(string, palette, variables)
{
	const result = { };
	result.preview = replaceNamedColors(string, palette);

	result.cppFormat = result.preview;

	result.preview		= replaceVariables(result.preview,	variables);
	result.comment		= removeSampColors(result.preview);
	result.cppFormat	= replaceVariables(result.cppFormat);
	result.cppFormat	= escapeSampColors(result.cppFormat);

	return result;
}