import React from 'react';

import {
	Grid,
	IconButton,
	TextField,
	Popover
} from '@material-ui/core';

import {
	ArrowUpward 	as UpIcon,
	ArrowDownward 	as DownIcon,
	Delete 			as RemoveIcon,	
} from '@material-ui/icons';

import SampChatText from './SampChatText'

import { ColorBox } from 'material-ui-color';

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

export default class SampChatTextPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			enumIdx: this.props.enumIdx || "",
			inputText: this.props.content || "",
			editingColorMode: false,
			editingColor: null,
			currentColor: "red"
		};

		this.textField = React.createRef();
		this.colorPicker = React.createRef();

		this.handleInputTextChanged = (e) => {
			this.setState({ inputText: e.target.value });
			this.props.onChange( { enumIdx: this.state.enumIdx, inputText: e.target.value } );
		}

		this.handleEnumIdxChanged = (e) => {
			this.setState({ enumIdx: e.target.value });
			this.props.onChange( { enumIdx: e.target.value, inputText: this.state.inputText } );
		}



		this.getHoverColorInfo = (selectionStart, selectionEnd) =>
		{
			if (this.state.inputText.length === 0)
				return null;
		
			let reg = /\{([a-fA-F0-9]{6})\}/g;
			let result;

			while((result = reg.exec(this.state.inputText)))
			{
				if (selectionStart === result.index + 1 && selectionEnd === result.index + 7)
					return { start: result.index + 1, end: result.index + 7 };
			}

			return null;
		}

		this.updateColorPicker = (selectionStart, selectionEnd) =>
		{	
			const hoverColor = this.getHoverColorInfo(selectionStart, selectionEnd);
			if (hoverColor !== null)
			{
				if (!this.state.editingColorMode)
				{
					this.setState( { currentColor: "#" + this.state.inputText.slice(hoverColor.start, hoverColor.end) } );
				}
			}
			
			this.setState( { editingColorMode: hoverColor !== null, editingColor: hoverColor } );
		};

		this.handleFocus = event => {
			event.preventDefault();
			const { target } = event;
			target.focus();
			this.updateColorPicker(target.selectionStart, target.selectionEnd);
		};

		this.handleSelectionUpdate = event =>
		{
			if (event.keyCode !== 27)
			{
				const { target } = event;
				this.updateColorPicker(target.selectionStart, target.selectionEnd);
			}
		};

		this.handleColorChange = (value) => {
			this.setState( { currentColor: value } );
			if (this.state.editingColorMode)
			{
				const inputText = spliceSlice(this.state.inputText, this.state.editingColor.start, 6, value.hex.substring(0, 6));
				this.setState( { inputText } );
			}
		};
	}

	render() {
		return (
			<Grid style={ { marginBottom: 10 } } container spacing={2}>
				<Grid container justifyContent="space-between" spacing={1} item xs={12} md={6}>
					<Grid container item xs={3} sm={2} md={3} lg={2}>
						<Grid item xs={4}>
							<IconButton onClick={() => this.props.onMovedUp()} > 	<UpIcon/> 		</IconButton>
						</Grid>
						<Grid item xs={4}>
							<IconButton onClick={() => this.props.onMovedDown()} > 	<DownIcon/> 	</IconButton>
						</Grid>
						<Grid item xs={4}>
							<IconButton onClick={() => this.props.onRemoved()} > 	<RemoveIcon/> 	</IconButton>
						</Grid>
					</Grid>
					<Grid item xs={3}>
						<TextField variant="filled" label="C++ identifier (enum name)"
								value={this.state.enumIdx || ""}
								onChange={this.handleEnumIdxChanged}
							/>
					</Grid>
					<Grid item xs={6} sm={7} md={6} lg={7}>
						<TextField ref={this.textField} fullWidth variant="filled" label="SAMP Chat Text"
								value={this.state.inputText || ""}
								onChange={this.handleInputTextChanged}
								onFocus={this.handleFocus}
								onDoubleClick={this.handleSelectionUpdate}
								onKeyDown={this.handleSelectionUpdate}
								onKeyUp={this.handleSelectionUpdate}
								onMouseUp={this.handleSelectionUpdate}	
							/>
						<Popover open={this.state.editingColorMode} anchorEl={() => this.textField.current}
								ref={this.colorPicker}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'center',
								}}
								onClose={(e) => {
									this.setState( { editingColorMode: false } );
									return true;
								}}
								// onKeyDown={this.handleColorPickerKeyDown}
								disableAutoFocus={true}
 								disableEnforceFocus={true}
								// disableEscapeKeyDown={true}
								disableRestoreFocus={true}
							>
							<ColorBox
									disableAlpha
									value={this.state.currentColor}
									onChange={this.handleColorChange}
								/>
						</Popover>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}>
					<SampChatText content={this.state.inputText}/>
				</Grid>
			</Grid>
		);
	}
}