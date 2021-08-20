import React from 'react';

import {
	Grid,
	IconButton,
	TextField,
	Popover,
	FormControl,
	InputLabel,
	Select
} from '@material-ui/core';

import {
	ArrowUpward 	as UpIcon,
	ArrowDownward 	as DownIcon,
	Delete 			as RemoveIcon,	
} from '@material-ui/icons';

import SampChatEntryPreview from './SampChatEntryPreview'

import { ColorBox } from 'material-ui-color';


export default class SampChatEntry extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			enumIdx: 			props.enumIdx || "",
			colorPickerEnabled: false,
			
		};

		if (props.content)
		{
			if (typeof props.content === "string")
			{
				this.state.content = [
					{ language: "Polish", content: props.content || "" },
					{ language: "English", content: props.content || "" },
				];
			}
			else if (Array.isArray(props.content))
			{
				this.state.content = props.content;
			}
		}


		this.colorPicker = React.createRef();
		this.textField = null;

		this.onTextFieldSelectionChange = (textField) =>
		{
			this.textField = textField;
		};

		// ////////////////////////////////////////////////
		this.handleEnumIdxChanged = (e) => {
			this.setState({ enumIdx: e.target.value });
			this.props.onChange( { enumIdx: e.target.value, content: this.state.content } );
		}

		this.handleContentChanged = (index, text) => {
			const newContent = this.state.content;
			newContent[index].content = text;
			this.setState({ content: newContent });
			this.props.onChange( { enumIdx: this.state.enumIdx, content: newContent } );
		}

		this.handleColorChange = newColor => {
			if (!this.textField || !this.textField.object)
				return;

			this.textField.object.changeSelectedColor(newColor);
		}
	}
	
	render() {
		return (
			<div>
				<Grid style={ { marginBottom: 10 } } container spacing={2}>
					<Grid container item xs={3} sm={2} md={1} lg={1}>
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
					<Grid item xs={1}>
						<TextField variant="filled" label="C++ enum name"
								value={this.state.enumIdx || ""}
								onChange={this.handleEnumIdxChanged}
							/>
					</Grid>
					{/*  */}
					<Grid container item xs={6} sm={7} md={6} lg={9}>
						{this.state.content?.map((e, idx) => (
							<SampChatEntryPreview
									language			={e.language}
									content				={e.content}
									onContentChanged	={(text) => this.handleContentChanged(idx, text)}
									onTextFieldSelectionChange={this.onTextFieldSelectionChange}
									onRequestColorPickerUpdate={e => this.setState( { colorPickerEnabled: e.enable, currentColor: e.colorValue } )}
								/>
						))}
					</Grid>
				</Grid>
				<Popover open={this.state.colorPickerEnabled} anchorEl={() => this.textField?.element}
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
							this.setState( { colorPickerEnabled: false } );
							return true;
						}}

						disableAutoFocus={true}
						disableEnforceFocus={true}
						disableRestoreFocus={true}
					>
					<ColorBox
							disableAlpha
							value={this.state.currentColor}
							onChange={this.handleColorChange}
						/>
				</Popover>
			</div>
		);
	}
}