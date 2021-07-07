import React from 'react';

import { Switch, Route, Redirect } from "react-router-dom";

import { withRouter } from "react-router";

import {
	Typography,
	TextField,
	Grid
} from '@material-ui/core';

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
			inputText: ""
		};

		this.handleInputTextChanged = (e) => {
			this.setState({ inputText: e.target.value });
		}
	}

	render() {
		return (
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<TextField fullWidth variant="filled" label="Enter SAMP chat text"
							onChange={this.handleInputTextChanged}
						/>
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

		this.enterUrl = (url) => {
			this.props.history.push(url);
		}
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

						<SampChatTextPreview />
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