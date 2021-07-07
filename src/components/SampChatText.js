import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
	Typography
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
	text: {
		// "-webkit-text-fill-color": "white", /* Will override color (regardless of order) */
		"-webkit-text-stroke-width": "0.5px",
		"-webkit-text-stroke-color": "black",
		"font-size": "16px",
		"font-family": "Arial",
		"font-weight": "bold",
		"display": "inline"
	},
	typography: {
		backgroundColor: "#222",
		height: "100%",
		padding: "0px 20px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center"
	}
}));

const SampChatText = (props) => {

	const classes = useStyles();

	let text = props.content || "";
	const textParts = [];
	let addText = (t) => {

		const nbsp = "\u00A0";

		if (t.startsWith(" "))
			t = nbsp + t.substring(1);
		if (t.endsWith(" "))
			t = t.substring(0, t.length - 1) + nbsp;

		textParts.push( (
			<span className={classes.text} style={ { color: currentColor } }>{t}</span>
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
		<Typography paragraph className={ classes.typography }>
			<span>{textParts}</span>
		</Typography>
	);
}

export default SampChatText;