import React from 'react';

// Material UI Components:
import {
	Grid,
	IconButton,
	TextField,
	Popover,
	Tooltip,
} from '@material-ui/core';

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
			cppName:				props.cppName || "",
			langSelectionEnabled:	false,
			editModeOpen: 			false,
			enumValid: 				true,
			editCppNameMode:		false,
		};

		this.state.editCppNameValue = this.state.cppName;

		if (props.content)
		{
			this.state.content = props.content;
		}
		
		this.langBtn		= React.createRef();

		this.validateCppName = (name) => {
			if (name === undefined)
				name = this.state.cppName;

			const result = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

			if (result !== this.state.enumValid)
				this.setState( { enumValid: result } );
		};

		// Execute once
		this.validateCppName();

		//////////////////////////////////////////////////
		this.handleCppNameChange = (newCppName) =>
		{
			this.setState({ cppName: newCppName });
			this.validateCppName(newCppName);
			this.props.onChange( { cppName: newCppName, content: this.state.content } );
		}

		this.handleCppNameAndContentChange = (newCppName, newContent) => {
			this.setState({ cppName: newCppName, content: newContent });
			this.validateCppName(newCppName);
			this.props.onChange( { cppName: newCppName, content: newContent } );
		}

		this.cancelEditCppName = () => {
			this.setState({
				editCppNameValue:	this.state.cppName,
				editCppNameMode:	false,
			});
		};
		this.applyEditCppName = () => {
			this.setState({
				cppName: 			this.state.editCppNameValue,
				editCppNameMode:	false,
			});
			this.handleCppNameChange(this.state.editCppNameValue);
		};

		this.handleKeyDownOnEditCppName = (event) =>
		{
			if (event.keyCode === 27) // escape
			{
				this.cancelEditCppName();
			}
			else if (event.keyCode === 13) // enter
			{
				this.applyEditCppName();
			}
		};

		//////////////////////////////////////////////////
		this.handleCppNameChangeInternal = ({target}) =>
		{
			this.setState({ editCppNameValue: target.value} );
		}

		this.handleContentChange = (content) => {
			this.setState( { content } );
			this.props.onChange( { cppName: this.state.cppName, content: content } );
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
			this.props.onChange( { cppName: this.state.cppName, content: newContent } );
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
		this.validateCppName(this.state.cppName);
	}
	
	render() {

		const ControlBtn = (props) => (
			<Tooltip title={props.title}><IconButton onClick={props.onClick}>{props.icon}</IconButton></Tooltip>
		);

		return (
			<div>
				<Grid container style={ { marginBottom: 15, border: "1px solid lightgray" } } spacing={2}>
					<Grid container item xs={8} sm={4} md={3} lg={3} xl={2}>
						<Grid item xs={2}>
							<ControlBtn title="Move up" icon={<UpIcon/>} onClick={() => this.props.onMovedUp()} />
						</Grid>
						<Grid item xs={2}>
							<ControlBtn title="Move down" icon={<DownIcon/>} onClick={() => this.props.onMovedDown()} />
						</Grid>
						<Grid item xs={1}></Grid>
						<Grid item xs={2}>
							<ControlBtn title="Delete" icon={<RemoveIcon/>} onClick={() => this.props.onRemoved()} />
						</Grid>
						<Grid item xs={2}>
							<ControlBtn title="Edit" icon={<EditIcon/>} onClick={() => this.onEdit()} />
						</Grid>
						<Grid item xs={1}></Grid>
						<Grid item xs={2} ref={this.langBtn}>
							<ControlBtn title="Select languages" icon={<TranslateIcon/>} onClick={this.toggleLangSelection} />
						</Grid>
					</Grid>
					<Grid item xs={12} sm={8} md={3} lg={3} xl={2}
						onDoubleClick={ () => { this.setState({ editCppNameMode: true }); console.log("XD"); } }>
						{this.state.editCppNameMode
							?
							(<TextField fullWidth variant="filled" label="C++ enum name"
									InputProps={{
										style: { fontFamily: "'Jetbrains Mono', Consolas, monospace" }
									}}
									autoFocus={true}
									error		={!this.state.enumValid}
									value		={this.state.editCppNameValue || ""}
									onChange	={this.handleCppNameChangeInternal}
									onBlur		={this.cancelEditCppName}
									onKeyDown	={this.handleKeyDownOnEditCppName}
									onFocus={event => {
										event.target.select();
									}}
								/>)
							:
							(<Tooltip title="Double click to edit">
								<TextField fullWidth variant="outlined" label="C++ enum name"
										InputProps={{
											readOnly:	true,
											onFocus:	(e) => e.currentTarget.blur(),
											style:		{ fontFamily: "'Jetbrains Mono', Consolas, monospace" }
										}}
										error		={!this.state.enumValid}
										value		={this.state.cppName || ""}
									/>
							</Tooltip>)
							}
						
					</Grid>
					{/*  */}
					<Grid container item xs={12} md={12} lg={6} xl={8}>
						{Object.entries(this.state.content)
							.filter	(([_, value]) => value.enabled)
							.map	(([key, value]) => (
							<Grid item xs={12}>
								<SampChatText key={key} content={value.value}/>
							</Grid>
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
				{this.state.editModeOpen ?
					(<SampChatMessageEditor
						open						={this.state.editModeOpen}
						cppName						={this.state.cppName}
						content						={this.state.content}
						onClose						={this.editModeClosed}
						onCppNameAndContentChange	={this.handleCppNameAndContentChange}
						onCppNameChange				={this.handleCppNameChange}
						onContentChange				={this.handleContentChange}
					/>)
					: null
				}
			</div>
		);
	}
}