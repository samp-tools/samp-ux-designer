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
import RemoveIcon from '@material-ui/icons/Delete';

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
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	}
});

class SampChatTextPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			inputText: this.props.content || ""
		};

		this.textField = React.createRef();

		this.handleInputTextChanged = (e) => {
			this.setState({ inputText: e.target.value });
		}
	}

	render() {
		return (
			<Grid style={ { marginBottom: 10 } } container spacing={2}>
				<Grid container justifyContent="space-between" item xs={12} md={6}>
					<Grid item xs={2} sm={1} md={2} lg={1}>
						<IconButton onClick={() => this.props.onRemoved()} >
							<RemoveIcon/>
						</IconButton>
					</Grid>
					<Grid item xs={10} sm={11} md={10} lg={11}>
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
			entries: [
				{ id: uuidv4(), content: "{00FF00}You {CCFFCC}healed yourself {00FF00}for free!" },
				{ id: uuidv4(), content: "Welcome to the {FF0000}Gold {FFFF00}Party {00CCFF}Polska {FFFFFF}server!" },
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
			const entries = this.state.entries.filter(entry => entry.id != uuid);
			this.setState( { entries } )
		}

		this.enterUrl = (url) => {
			this.props.history.push(url);
		}

		this.getEntryElements = (entries) => (
			entries.map((entry, index) => (
				<SampChatTextPreview key={entry.id} content={entry.content} onRemoved={() => this.handleRemoveChatMessage(entry.id)}/>
			))
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

						{addBtn(true)}
						{this.getEntryElements(this.state.entries).map(el => el)}
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