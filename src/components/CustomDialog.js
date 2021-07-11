import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@material-ui/core';


export default class CustomDialog extends React.Component {

	constructor(props) { 
		super(props);

		this.state = {
			open: false
		}

		this.setOpen = (o) => {
			this.setState({ open: o });
		}
	}

	render() {
		return (<Dialog
			open={this.state.open}
			onClose={() => this.setOpen(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{this.props.children}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => this.setOpen(false)} color="primary" autoFocus>
					OK
				</Button>
			</DialogActions>
		</Dialog>);
	}
}