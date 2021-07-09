import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Switch, Route, Redirect } from "react-router-dom";

import { withRouter } from "react-router";

import {
	Typography,
	TextField,
	Grid,
	Button, IconButton
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import RemoveIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';

import PropTypes from 'prop-types';

import SampChatText from './SampChatText'

import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	topContentBar: {
		alignItems: 'center',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	}
});

class SampChatTextPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			enumIdx: this.props.enumIdx || "",
			inputText: this.props.content || ""
		};

		this.textField = React.createRef();

		this.handleInputTextChanged = (e) => {
			this.setState({ inputText: e.target.value });
			this.props.onChange(this.state);
		}

		this.handleEnumIdxChanged = (e) => {
			this.setState({ enumIdx: e.target.value });
			this.props.onChange(this.state);
		}
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
							>
							<b>Chuj</b>
						</TextField>
					</Grid>
					<Grid item xs={6} sm={7} md={6} lg={7}>
						<TextField ref={this.textField} fullWidth variant="filled" label="SAMP Chat Text"
								value={this.state.inputText || ""}
								onChange={this.handleInputTextChanged}
							/>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}>
					<SampChatText content={this.state.inputText}/>
				</Grid>
			</Grid>
		);
	}
}


class DesignerContent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchPattern: "",
			entries: [
				{ id: uuidv4(), enumIdx: "TXT_HEALED", content: "{00FF00}You {CCFFCC}healed yourself {00FF00}for free!" },
				{ id: uuidv4(), enumIdx: "TXT_WELCOME", content: "Welcome to the {FF0000}Gold {FFFF00}Party {00CCFF}Polska {FFFFFF}server!" },
			]
		};

		this.handleAddNewChatMessage = (front) => {
			const entries = this.state.entries;
			const newElem = { id: uuidv4(), content: "Chat message {FF0000}content..." };

			if (front)
				entries.unshift(newElem);
			else
				entries.push(newElem);

			this.setState( { entries } )
		}

		this.handleRemoveChatMessage = (uuid) => {
			const entries = this.state.entries.filter(entry => entry.id !== uuid);
			this.setState( { entries } )
		}
		this.handleSearchPatternChanged = (e) => {
			this.setState( { searchPattern: e.target.value || "" } )
		}
		this.handleEntryChanged = (entryIndex, newValue) => {
			const entries = this.state.entries;
			entries[entryIndex].enumIdx = newValue.enumIdx || "";
			entries[entryIndex].content = newValue.inputText || "";
			this.setState({ entries });
		}

		this.moveEntry = (entryIndex, newEntryIndex) =>
		{
			
			if (entryIndex < 0 || entryIndex >= this.state.entries.length)
			return; // ignore
			
			if (newEntryIndex < 0 || newEntryIndex >= this.state.entries.length)
			return; // ignore
			
			const entries = this.state.entries;
			entries.splice(newEntryIndex, 0, entries.splice(entryIndex, 1)[0]);

			this.setState( { entries });
		}

		this.enterUrl = (url) => {
			this.props.history.push(url);
		}

		this.getEntryElements = (entries) => {
			const p = this.state.searchPattern;
			const filtered = p !== "" ? entries.filter(e => (e.enumIdx || "").toLowerCase().search(p.toLowerCase()) !== -1) : entries;
			const result = filtered.map((entry, index) => (
				<SampChatTextPreview
						key={entry.id}
						enumIdx={entry.enumIdx}
						content={entry.content}
						onChange={(val) => this.handleEntryChanged(index, val)}
						onRemoved={() => this.handleRemoveChatMessage(entry.id)}
						onMovedUp={() => this.moveEntry(index, index - 1)}
						onMovedDown={() => this.moveEntry(index, index + 1)} />
			));

			if (result.length > 0)
				return result;
			else
				return (<Typography paragraph>No entries{entries.length > 0 ? ` that match pattern "${p}"` : ""}.</Typography>);
		};
	}

	generateJsonContent() {
		return JSON.stringify({
			chatMessages: this.state.entries.map(e => ({ id: e.enumIdx || "", content: e.content || "" }))
		}, null, '\t');
	}

	loadFromJson(jsonContent) {
		const jc = JSON.parse(jsonContent);
		console.log(jc);
		this.setState(
			{
				entries: jc.chatMessages.map(cm => ({
					id: uuidv4(),
					enumIdx: cm.id || "",
					content: cm.content || ""
				}))
			}
		);
	}

	componentDidMount() {
		this.props.customRef(this);
	}


	render() {
		const { classes } = this.props;

		const addBtn = (front = false) => (
			<Button style={ { marginBottom: 10, marginTop: 10 } } size="large" variant="contained" color="primary" startIcon={<AddIcon/>}
					onClick={() => this.handleAddNewChatMessage(front)}
				>
				Add{front ? " to the top" : ""}
			</Button>
		);

		return (
			<main className={classes.content}>
				<div className={classes.toolbar} />
				<Switch>
					<Route exact path='/'
						component={() => (<Redirect to='/chat' />)} />
					<Route path="/chat">
						<Typography variant="h3">
							Chat messages
						</Typography>
						<Typography paragraph>
							Enter SAMP chat text (with <tt>{"{AABBCC}"}</tt> color format rules)<br/>
							to see how it would look like in the in-game chat.
						</Typography>

						<Grid container spacing={2} className={classes.topContentBar}>
							<Grid item xs="auto">
								{addBtn(true)}
							</Grid>
							<Grid item xs={3}>
								<TextField fullWidth InputProps={{ startAdornment: <SearchIcon/> }} placeholder="Filter by enum name"
										onChange={this.handleSearchPatternChanged}/>
							</Grid>
						</Grid>
						
						{this.getEntryElements(this.state.entries)}
						{addBtn()}
						
							
					</Route>
					<Route path="/dialog">
						<Typography variant="h1">
							Dialogs
						</Typography>
						<Typography paragraph>
							Work in progress...
						</Typography>
					</Route>
				</Switch>
			</main>
		);
	}
}


DesignerContent.propTypes = {
	classes: PropTypes.object.isRequired,
};


export default withStyles(useStyles)(withRouter(DesignerContent));