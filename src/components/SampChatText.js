import React from 'react';

const SampChatText = (props) => {

	let text = props.content || "";
	const textParts = [];
	let addText = (t) => {
		textParts.push( (
			<font style={ { color: currentColor } }>{t}</font>
		));
	};

	let removeColors = (props.keepColors === undefined) ? true : !props.keepColors;

	let currentColor = props.defaultColor || "#ffffff";

	if (text.length > 0) {
	
		let reg = /\{([a-fA-F0-9]{6})\}/g;
		let result;
		let prevStart = 0;
		const getPrevStart = () => {
			return (removeColors || prevStart < 8) ? prevStart : prevStart - 8;
		}

		while((result = reg.exec(text)))
		{
			if (reg.lastIndex !== undefined)
			{
				if (result.index !== 0)
					addText(text.substring(getPrevStart(), result.index));

				prevStart = reg.lastIndex;
				currentColor = `#${result[1]}`;
			}
		}
		addText(text.substring(getPrevStart()));
	}

	return (
		<p>
			{textParts}
		</p>
	);
}

export default SampChatText;