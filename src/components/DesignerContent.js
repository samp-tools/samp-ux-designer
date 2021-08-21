import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Switch, Route, Redirect } from "react-router-dom";

import { withRouter } from "react-router";

import {
	Typography,
	TextField,
	Grid,
	Button
} from '@material-ui/core';


import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

import PropTypes from 'prop-types';

import ChatMessagesEditor 	from './ChatMessagesEditor';
import LanguagesEditor 		from './LanguagesEditor';

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


class DesignerContent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			
			palette: [
				{ name: "Dollarbill", value: "#85bb65" }
			]
		};

		this.error = (title, content) => this.props.onError(title, content);

		this.enterUrl = (url) => {
			this.props.history.push(url);
		}
	}

	generateJsonContent() {
		return JSON.stringify({
			chatMessages: this.state.entries.map(e => ({ id: e.enumIdx || "", content: e.content || "" }))
		}, null, '\t');
	}

	loadFromJson(jsonContent) {
		const jc = JSON.parse(jsonContent);
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

						<ChatMessagesEditor />
							
					</Route>
					<Route path="/dialog">
						<Typography variant="h3">
							Dialogs
						</Typography>
						<Typography paragraph>
							Work in progress...
						</Typography>
					</Route>
					<Route path="/palette">
						<Typography variant="h3">
							Color palette
						</Typography>
						<Typography paragraph>
							Enter colors:
						</Typography>

						{}
					</Route>
					<Route path="/lang">
						<Typography variant="h3">
							Language setup
						</Typography>
						<Typography paragraph>
							Enter languages:
						</Typography>
						<LanguagesEditor />
						{}
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