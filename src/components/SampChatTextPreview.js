import React from 'react';

import {
	Grid,
	IconButton,
	TextField
} from '@material-ui/core';

import {
	ArrowUpward 	as UpIcon,
	ArrowDownward 	as DownIcon,
	Delete 			as RemoveIcon,	
} from '@material-ui/icons';

import SampChatText from './SampChatText'

export default class SampChatTextPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			enumIdx: this.props.enumIdx || "",
			inputText: this.props.content || ""
		};

		this.textField = React.createRef();

		this.handleInputTextChanged = (e) => {
			this.setState({ inputText: e.target.value });
			this.props.onChange( { enumIdx: this.state.enumIdx, inputText: e.target.value } );
		}

		this.handleEnumIdxChanged = (e) => {
			this.setState({ enumIdx: e.target.value });
			this.props.onChange( { enumIdx: e.target.value, inputText: this.state.inputText } );
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