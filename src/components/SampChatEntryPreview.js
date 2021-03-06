import React from 'react';

import {
	Grid,
	TextField,
} from '@material-ui/core';

// [Custom] Contexts:
import LangsCtx				from '../contexts/LangsCtx';

// [Custom]: Components
import SampChatText from './SampChatText';


function spliceSlice(str, index, count, add) {
	// We cannot pass negative indexes directly to the 2nd slicing operation.
	if (index < 0) {
		index = str.length + index;
		if (index < 0) {
		index = 0;
		}
	}

	return str.slice(0, index) + (add || "") + str.slice(index + count);
}

export default class SampChatEntryPreview
	extends React.Component
{
	static contextType = LangsCtx;

	constructor(props) {
		super(props);

		this.state = {
			language: 	props.language,
			content: 	props.content || "",
		};
		
		this.textField = React.createRef();
		

		this.languageDisplayName = () => {
			const idx = this.context.langs.findIndex(lang => lang.id === this.state.language);
			if (idx !== -1)
				return this.context.langs[idx].name;
			
			return "Unknown";
		}

		////////////////////////////////////////////////
		this.handleInputTextChanged = (e) =>
		{
			this.setState({ content: e.target.value });

			// Propagate changes to owner
			this.props.onContentChange?.( e.target.value );
		}

		////////////////////////////////////////////////
		this.getHoverColorInfo = (selectionStart, selectionEnd) =>
		{
			if (this.state.content.length === 0)
				return null;
		
			let reg = /\{([a-fA-F0-9]{6})\}/g;
			let result;

			while((result = reg.exec(this.state.content)))
			{
				if (selectionStart === result.index + 1 && selectionEnd === result.index + 7)
					return { start: result.index + 1, end: result.index + 7 };
			}

			return null;
		}

		////////////////////////////////////////////////
		this.updateColorPicker = (selectionStart, selectionEnd) =>
		{	
			const hoverColor = this.getHoverColorInfo(selectionStart, selectionEnd);
			let currentColor = "";
			if (hoverColor !== null)
			{
				if (!this.state.editingColorMode)
				{
					currentColor = "#" + this.state.content.slice(hoverColor.start, hoverColor.end);
					this.setState( { currentColor } );
				}
			}
			this.setState( { editingColor: hoverColor } );

			// Request color picker from the parent
			if (this.props.onRequestColorPickerUpdate)
				this.props.onRequestColorPickerUpdate( { enable: hoverColor !== null, colorValue: currentColor || "#000000" } );
		};

		////////////////////////////////////////////////
		this.handleFocus = event => {
			event.preventDefault();
			const { target } = event;
			target.focus();
			this.updateColorPicker(target.selectionStart, target.selectionEnd);

			this.props.onTextFieldSelectionChange( { object: this, element: this.textField.current } );
		};

		////////////////////////////////////////////////
		this.handleSelectionUpdate = event =>
		{
			if (event.keyCode !== 27)
			{
				const { target } = event;
				this.updateColorPicker(target.selectionStart, target.selectionEnd);
				this.props.onTextFieldSelectionChange( { object: this, element: this.textField.current } );
			}
		};

		////////////////////////////////////////////////
		this.changeSelectedColor = (value) => {

			// No color info
			if (!this.state.editingColor)
				return false;

			const inputText = spliceSlice(this.state.content, this.state.editingColor.start, 6, value.hex.substring(0, 6));
			this.setState( {
					currentColor: value,
					content: inputText
				} );

			this.props.onContentChange?.( inputText );
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.content !== this.props.content)
		{
			this.setState( { content: this.props.content } )
		}
	}

	render() {
		return (
			<Grid style={this.props.style} container item={this.props.item ? true : undefined} spacing={1}>
				<Grid item xs={12} md={6}>
					<TextField ref={this.textField} fullWidth variant="filled" label={`${this.languageDisplayName()} - SAMP Chat Text`}
							InputProps={{
								style: {
									fontFamily: "'Jetbrains Mono', Consolas, monospace",
									fontSize: "100%",
									letterSpacing: -1.5
								}
							}}

							value			={this.state.content || ""}
							onChange		={this.handleInputTextChanged}
							onFocus			={this.handleFocus}
							onDoubleClick	={this.handleSelectionUpdate}
							onKeyDown		={this.handleSelectionUpdate}
							onKeyUp			={this.handleSelectionUpdate}
							onMouseUp		={this.handleSelectionUpdate}	
						/>
				</Grid>
				<Grid item xs={12} md={6}>
					<SampChatText
							variables	={this.props.variables}
							content		={this.state.content}
						/>
				</Grid>
			</Grid>
		);
	}	
}