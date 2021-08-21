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
} from '@material-ui/icons';

// [Custom] Components:
import SampChatEntryPreview		from './SampChatEntryPreview'
import LanguageSelector 		from './LanguageSelector';

export default class SampChatEntry extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			enumIdx:				props.enumIdx || "",
			colorPickerEnabled: 	false,
			langSelectionEnabled:	false,
		};

		if (props.content)
		{
			this.state.content = props.content;
		}

		this.colorPicker 	= React.createRef();
		this.langBtn		= React.createRef();

		// Custom ref
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
			newContent[index].value = text;
			this.setState({ content: newContent });
			this.props.onChange( { enumIdx: this.state.enumIdx, content: newContent } );
		}

		this.handleColorChange = newColor => {
			if (!this.textField || !this.textField.object)
				return;

			this.textField.object.changeSelectedColor(newColor);
		}

		this.toggleLangSelection = () => {
			this.setState( {
				langSelectionEnabled: !this.state.langSelectionEnabled
			} );
		}

		this.onLanguageToggled = (langUid, enabled) => {
			const newContent = this.state.content;
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
	}
	
	render() {
		return (
			<div>
				<Grid container style={ { marginBottom: 10 } } spacing={2}>
					<Grid container item xs={8} sm={4} md={2} lg={1}>
						<Grid item xs={3}>
							<IconButton onClick={() => this.props.onMovedUp()} > 	<UpIcon/> 		</IconButton>
						</Grid>
						<Grid item xs={3}>
							<IconButton onClick={() => this.props.onMovedDown()} > 	<DownIcon/> 	</IconButton>
						</Grid>
						<Grid item xs={3}>
							<IconButton onClick={() => this.props.onRemoved()} > 	<RemoveIcon/> 	</IconButton>
						</Grid>
						<Grid item xs={3} ref={this.langBtn}>
							<IconButton onClick={this.toggleLangSelection}> <TranslateIcon/> </IconButton>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={8} md={3} lg={2} xl={1}>
						<TextField fullWidth variant="filled" label="C++ enum name"
								value={this.state.enumIdx || ""}
								onChange={this.handleEnumIdxChanged}
							/>
					</Grid>
					{/*  */}
					<Grid container item xs={12} md={7} lg={9} xl={10}>
						{Object.entries(this.state.content)
							.filter	(([_, value]) => value.enabled)
							.map	(([key, value]) => (
							<SampChatEntryPreview 
									key					={key}
									language			={key}
									content				={value.value}
									onContentChanged	={(text) => this.handleContentChanged(key, text)}
									onTextFieldSelectionChange={this.onTextFieldSelectionChange}
									onRequestColorPickerUpdate={e => this.setState( { colorPickerEnabled: e.enable, currentColor: e.colorValue } )}
								/>
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
			</div>
		);
	}
}