import React from 'react';

// Material UI Components:
import {
	Grid,
	IconButton,
	TextField,
	Popover,
} from '@material-ui/core';

// Material UI Extension Components:
import { ColorBox } from 'material-ui-color';

// Material UI Icons:
import {
	ArrowUpward 	as UpIcon,
	ArrowDownward 	as DownIcon,
	Delete 			as RemoveIcon,
	Translate		as TranslateIcon,
	Edit			as EditIcon,
} from '@material-ui/icons';

// [Custom] Components:
import SampChatText				from './SampChatText';
import LanguageSelector 		from './LanguageSelector';
import SampChatMessageEditor 	from './SampChatMessageEditor';

export default class SampChatEntry extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			enumIdx:				props.enumIdx || "",
			colorPickerEnabled: 	false,
			langSelectionEnabled:	false,
			editModeOpen: 			false,
			enumValid: 				true
		};

		if (props.content)
		{
			this.state.content = props.content;
		}

		this.colorPicker 	= React.createRef();
		this.langBtn		= React.createRef();

		// Custom ref
		this.textField = null;

		this.validateEnumName = (name) => {
			if (name === undefined)
				name = this.state.enumIdx;

			const result = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

			if (result !== this.state.enumValid)
				this.setState( { enumValid: result } );
		};

		// Execute once
		this.validateEnumName();

		this.onTextFieldSelectionChange = (textField) =>
		{
			this.textField = textField;
		};

		// ////////////////////////////////////////////////
		this.handleEnumIdxChanged = (e) => {
			this.setState({ enumIdx: e.target.value });
			this.validateEnumName(e.target.value);
			this.props.onChange( { enumIdx: e.target.value, content: this.state.content } );
		}

		this.handleContentChanged = (index, text) => {
			const newContent = {...this.state.content};
			newContent[index].value = text;
			this.setState({ content: newContent });
			this.props.onChange( { enumIdx: this.state.enumIdx, content: newContent } );
		}

		this.handleColorChange = newColor => {
			if (!this.textField || !this.textField.object)
				return;

			this.setState( { currentColor: newColor } );
			this.textField.object.changeSelectedColor(newColor);
		}

		this.toggleLangSelection = () => {
			this.setState( {
				langSelectionEnabled: !this.state.langSelectionEnabled
			} );
		}

		this.onLanguageToggled = (langUid, enabled) => {
			const newContent = {...this.state.content};
			if (enabled)
			{
				if (newContent[langUid] === undefined)
					newContent[langUid] = { value: '' };

				newContent[langUid].enabled = true;
			}
			else
			{
				if (newContent[langUid] !== undefined)
					newContent[langUid].enabled = false;
			}

			// Propagate changes:
			this.setState({ content: newContent });
			this.props.onChange( { enumIdx: this.state.enumIdx, content: newContent } );
		}

		this.shownLangs = () => {
			return Object.entries(this.state.content).map(([key, _]) => key);
		}

		this.onEdit = () => {
			if (!this.state.editModeOpen)
				this.setState({ editModeOpen: true });
		}

		this.editModeClosed = () => {
			this.setState({ editModeOpen: false });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		this.validateEnumName(this.state.enumIdx);
	}
	
	render() {
		return (
			<div>
				<Grid container style={ { marginBottom: 10 } } spacing={2}>
					<Grid container item xs={8} sm={4} md={3} lg={3} xl={2}>
						<Grid item xs={2}>
							<IconButton onClick={() => this.props.onMovedUp()} > 	<UpIcon/> 		</IconButton>
						</Grid>
						<Grid item xs={2}>
							<IconButton onClick={() => this.props.onMovedDown()} > 	<DownIcon/> 	</IconButton>
						</Grid>
						<Grid item xs={1}></Grid>
						<Grid item xs={2}>
							<IconButton onClick={() => this.props.onRemoved()} > 	<RemoveIcon/> 	</IconButton>
						</Grid>
						<Grid item xs={2}>
							<IconButton onClick={() => this.onEdit()} > 		<EditIcon/> 	</IconButton>
						</Grid>
						<Grid item xs={1}></Grid>
						<Grid item xs={2} ref={this.langBtn}>
							<IconButton onClick={this.toggleLangSelection}> <TranslateIcon/> </IconButton>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={8} md={3} lg={3} xl={2}>
						<TextField fullWidth variant="filled" label="C++ enum name"
								InputProps={ { style: { fontFamily: "'Jetbrains Mono', Consolas, monospace" } } }
	
								error={!this.state.enumValid}
								helperText={this.state.enumValid ? null : <span>Use only characters <b><tt>a-z</tt></b>, <b><tt>A-Z</tt></b>, <b><tt>0-9</tt></b> and <b><tt>_</tt></b>. Do not start with a digit!</span>}

								value={this.state.enumIdx || ""}
								onChange={this.handleEnumIdxChanged}
							/>
					</Grid>
					{/*  */}
					<Grid container item xs={12} md={12} lg={6} xl={8}>
						{Object.entries(this.state.content)
							.filter	(([_, value]) => value.enabled)
							.map	(([key, value]) => (
							<Grid item xs={12}>
								<SampChatText key={key} content={value.value}/>
							</Grid>
							// <SampChatEntryPreview 
							// 		key					={key}
							// 		language			={key}
							// 		content				={value.value}
							// 		onContentChanged	={(text) => this.handleContentChanged(key, text)}
							// 		onTextFieldSelectionChange={this.onTextFieldSelectionChange}
							// 		onRequestColorPickerUpdate={e => this.setState( { colorPickerEnabled: e.enable, currentColor: e.colorValue } )}

							// 		style={ { marginBottom: '1px' } }
							// 	/>
						))}
					</Grid>
				</Grid>
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
							shownLangs={this.shownLangs()}
							onLanguageToggled={this.onLanguageToggled}
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
				<SampChatMessageEditor
						open={this.state.editModeOpen}
						enumName={this.state.enumIdx}
						content={this.state.content}
						onClose={this.editModeClosed}
					/>			
			</div>
		);
	}
}