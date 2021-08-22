import React from 'react';

import { Switch, Route, Redirect } from "react-router-dom";

import { withRouter } from "react-router";

import {
	Typography,
} from '@material-ui/core';


import PropTypes from 'prop-types';

import ChatMessagesEditor 	from './ChatMessagesEditor';
import LanguagesEditor 		from './LanguagesEditor';
import PaletteEditor 		from './PaletteEditor';

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

						<ChatMessagesEditor
								onError={this.error}
							/>
							
					</Route>

					<Route path="/dialog">
						<Typography variant="h3">
							Dialogs
						</Typography>
						<Typography paragraph>
							Work in progress...
						</Typography>
					</Route>

					<Route path="/lang">
						<Typography variant="h3">
							Language setup
						</Typography>
						<Typography paragraph>
							Enter languages:
						</Typography>

						<LanguagesEditor />

					</Route>

					<Route path="/palette">
						<Typography variant="h3">
							Color palette
						</Typography>
						<Typography paragraph>
							Setup your color palette.
							<br/>
							Use <b>double click</b> to edit color names and invocations.
							<br/>
							<b>Click</b> on the color box to edit its value.
						</Typography>

						<PaletteEditor />

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