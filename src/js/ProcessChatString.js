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

const replaceVariable = (text, varName, varValue) => {
	const regex = `\\{\\^${varName}\\|([^\\{\\}]*)\\}`;
	if (text.length > 0) {
		text = text.replaceAll(new RegExp(regex, 'g'),
			(wholeMatch, varName, formatter) =>
			{
				if (varValue === undefined)
					return `{${formatter}}`;
				return varValue;
			});
	}

	return text;
}

export function processChatString(string, palette, variables)
{
	const result = { };
	result.preview = replaceNamedColors(string, palette);

	result.cppFormat = result.preview;
	if (typeof variables === 'object')
	{
		for (const varName in variables)
		{
			result.preview = replaceVariable(result.preview, varName, variables[varName]);
			result.cppFormat = replaceVariable(result.cppFormat, varName);
		}
	}

	return result;
}