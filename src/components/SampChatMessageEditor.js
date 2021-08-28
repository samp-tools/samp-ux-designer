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
} from '@material-ui/core';

import {
	Save 		as SaveIcon,
	Restore		as RevertIcon,
	Close		as ExitIcon,
	Translate	as TranslateIcon,
} from '@material-ui/icons';

import SampChatEntryPreview	from './SampChatEntryPreview';
import LanguageSelector 	from './LanguageSelector';

export default class SampChatMessageEditor
	extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			messageIdx:	this.props.messageIdx || "",
			enumName: 	this.props.enumName || "ChatMessage",
			content: 	this.props.content || "",
			anyChanges: false
		};

		this.langBtn = React.createRef();

		this.handleContentChanged = () => {
			this.setState({ anyChanges: true});
			// TODO: implement this
		};
		
		this.onTextFieldSelectionChange = () => {
			// TODO: implement this
		};

		this.applyChanges = () => {
			if (!this.state.anyChanges)
				return;

			this.setState( { anyChanges: false } );

			// TODO: apply changes
		}

		this.revertChanges = () => {
			if (!this.state.anyChanges)
				return;

			this.setState( { anyChanges: false } );

			this.setState( {
				messageIdx:	this.props.messageIdx 	|| "",
				enumName: 	this.props.enumName 	|| "ChatMessage",
				content: 	this.props.content 		|| "",
			} )
			// TODO: revert changes
		}

		this.handleOpenTranslations = () => {
			this.setState({ langSelectionEnabled: true });
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
			this.props.onChange?.( { enumIdx: this.state.enumIdx, content: newContent } );
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
					Editing: <b><tt>{this.state.enumName}</tt></b>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Settings:
					</DialogContentText>
					<Grid container>
						
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
										onContentChanged	={(text) => this.handleContentChanged(key, text)}
										onTextFieldSelectionChange={this.onTextFieldSelectionChange}
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
							shownLangs={this.shownLangs()}
							onLanguageToggled={this.onLanguageToggled}
						/>
				</Popover>
			</Dialog>
		);
	}
}

