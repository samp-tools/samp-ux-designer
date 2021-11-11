import React from 'react';

import {
	Grid,
	IconButton,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Popover,
	TextField
} from '@material-ui/core';

import {
	Save 		as SaveIcon,
	Restore		as RevertIcon,
	Close		as ExitIcon,
	Translate	as TranslateIcon,
	Add			as AddIcon,
} from '@material-ui/icons';

// Material UI Extension Components:
import { ColorBox } from 'material-ui-color';


import SampChatEntryPreview	from './SampChatEntryPreview';
import LanguageSelector 	from './LanguageSelector';

export default class SampChatMessageEditor
	extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			messageIdx:			props.messageIdx	|| "",
			cppName:			props.cppName		|| "ChatMessage",
			content:			props.content		|| "",
			variables:			props.variables		|| {},
			colorPickerEnabled:	false,
			anyChanges:			false,
			enumValid:			true
		};

		this.langBtn		= React.createRef();
		this.colorPicker	= React.createRef();

		// Custom ref
		this.textField = null;


		this.validateCppName = (name) => {
			if (name === undefined)
				name = this.state.cppName;

			const result = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

			if (result !== this.state.enumValid)
				this.setState( { enumValid: result } );
		};

		// Execute once
		this.validateCppName();

		this.handleContentChange = (langKey, text) =>
		{
			// Copy content object:
			const newContent = {...this.state.content};

			// Copy and modify content object:
			newContent[langKey] = { ...newContent[langKey], value: text };
			// Apply changes locally.
			this.setState(
				{
					anyChanges: true,
					content: 	newContent,
				}
			);
			
		};

		//////////////////////////////////////////////////
		this.handleCppNameChange = ({target}) =>
		{
			this.setState(
				{
					anyChanges:	true,
					cppName:	target.value,
				}
			);

			this.validateCppName(target.value);
		}
		
		this.handleTextFieldSelectionChange = (textField) =>
		{
			this.textField = textField;
		};

		this.handleColorChange = (newColor) =>
		{
			if (!this.textField || !this.textField.object)
				return;

			this.setState( { currentColor:	newColor } );
			this.textField.object.changeSelectedColor(newColor);
		}

		this.applyChanges = () =>
		{
			if (!this.state.anyChanges)
				return;

			this.setState( { anyChanges: false } );
			this.props.onCppNameAndContentChange( this.state.cppName, this.state.content );
		}

		this.revertChanges = () =>
		{
			if (!this.state.anyChanges)
				return;

			this.setState( {
				anyChanges: false,
				messageIdx:	this.props.messageIdx	|| "",
				cppName: 	this.props.cppName		|| "ChatMessage",
				content: 	this.props.content		|| "",
			} );
		}

		this.handleAddVariableSubstitute = () =>
		{
			const BaseVarName = "VarName";

			const vars = {...this.state.variables};
			const findFreeName = () => {
				if (vars[BaseVarName] === undefined)
					return BaseVarName;

				let freeIdx = 1;
				while(vars[BaseVarName + freeIdx] !== undefined)
					++freeIdx;

				return BaseVarName + freeIdx;
			};

			vars[findFreeName()] = 'VALUE';

			this.setState( {
				anyChanges:	true,
				variables:	vars,
			} );
		};

		this.handleOpenTranslations = () => {
			this.setState({ langSelectionEnabled: true });
		};

		this.onLanguageToggled = (langUid, enabled) => {
			const newContent = {...this.state.content};
			if (enabled)
			{
				if (newContent[langUid] === undefined)
					newContent[langUid] = { value: '' };

				newContent[langUid] = { ...newContent[langUid], enabled: true };
			}
			else
			{
				if (newContent[langUid] !== undefined)
					newContent[langUid] = { ...newContent[langUid], enabled: false };
			}

			// Propagate changes:
			this.setState(
				{
					anyChanges:	true,
					content: 	newContent,
				}
			);
			this.props.onContentChange( newContent );
		}

		this.shownLangs = () => {
			return Object.entries(this.state.content).map(([key, _]) => key);
		}
	}

	render() {

		return (
			<Dialog fullWidth maxWidth="lg"
					open={this.props.open}
					onClose={this.props.onClose}
				>
				<DialogTitle>
					Editing: <b><tt>{this.props.cppName || "ChatMessage"}</tt></b>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Settings:
					</DialogContentText>
					<Grid container>
						<TextField variant="filled" label="C++ enum name"
								InputProps={ { style: { fontFamily: "'Jetbrains Mono', Consolas, monospace" } } }

								error={!this.state.enumValid}
								helperText={this.state.enumValid ? null : <span>Use only characters <b><tt>a-z</tt></b>, <b><tt>A-Z</tt></b>, <b><tt>0-9</tt></b> and <b><tt>_</tt></b>. Do not start with a digit!</span>}

								value={this.state.cppName || ""}
								onChange={this.handleCppNameChange}
							/>
					</Grid>
					<DialogContentText>
						Variable substitutes: <IconButton onClick={this.handleAddVariableSubstitute}><AddIcon/></IconButton>
					</DialogContentText>
					<Grid container>
						{Object.entries(this.state.variables)
								.map(([key, value]) => (
								<Grid container item xs={12}>
									<Grid item xs={2}>
										{key}
									</Grid>
									<Grid item xs={2}>
										{value}
									</Grid>
								</Grid>	
							))}
					</Grid>
					<DialogContentText>
						Translations: <IconButton onClick={this.handleOpenTranslations} ref={this.langBtn}><TranslateIcon/></IconButton>
					</DialogContentText>
					<Grid container>
						{Object.entries(this.state.content)
								.filter	(([_, value]) => value.enabled)
								.map	(([key, value]) => (
								<SampChatEntryPreview 
										key					={key}
										language			={key}
										content				={value.value}
										variables			={this.state.variables}
										onContentChange		={(text) => this.handleContentChange(key, text)}
										onTextFieldSelectionChange={this.handleTextFieldSelectionChange}
										onRequestColorPickerUpdate={e => this.setState( { colorPickerEnabled: e.enable, currentColor: e.colorValue } )}

										style={ { marginBottom: '1px' } }
									/>
							))}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="primary"
							disabled={!this.state.anyChanges}
							onClick={this.applyChanges}
							startIcon={<SaveIcon/>}
						>
						Apply
					</Button>
					<Button variant="contained" color="secondary"
							disabled={!this.state.anyChanges}
							onClick={this.revertChanges}
							startIcon={<RevertIcon/>}
						>
						Revert
					</Button>
					<Button variant="contained" color="default"
							onClick={this.props.onClose}
							startIcon={<ExitIcon/>}
						>
						Close
					</Button>
				</DialogActions>
				<Popover open={this.state.langSelectionEnabled} anchorEl={() => this.langBtn.current}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						onClose={(e) => {
							this.setState( { langSelectionEnabled: false } );
							return true;
						}}
						disableAutoFocus={true}
						disableEnforceFocus={true}
						disableRestoreFocus={true}
					>
					<LanguageSelector
							shownLangs			={this.shownLangs()}
							onLanguageToggled	={this.onLanguageToggled}
						/>
				</Popover>
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
			</Dialog>
		);
	}
}

