import React from 'react';

// Material UI Components:
import {
	Grid,
	TextField
} from '@material-ui/core';

const EditMode = {
	None: 	0,
	Name: 	1,
	Invoc: 	2
};

export default class PaletteColor
	extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			editMode: 	EditMode.None,
			prettyName:	this.props.prettyName,
			invoc: 		this.props.invocation,
			value:		this.props.value,
		};

		this.colorFieldRef = React.createRef();

		this.applyChange = (toWhat, value) =>
		{
			const newState =  {
				prettyName:	this.state.prettyName,
				invoc:		this.state.invoc,
			};	
			switch(toWhat)
			{
			case EditMode.Name:		newState.prettyName = value; break;
			case EditMode.Invoc:	newState.invoc = value; break;
			default: break;
			}
			this.setState(newState);

			this.props.onChange(newState);
		}
	}

	componentDidUpdate(prevProps, prevState)
	{
		if (prevProps.value !== this.props.value
			&& this.state.value !== this.props.value)
		{
			// I don't know why but without this line
			// it does not work.
			this.setState({ value: this.props.value });
		}
	}

	render()
	{
		const center = { style: { display: "flex", alignItems: "center" } };
		return (
			<Grid container spacing={1}>
				<Grid item xs={3} {...center}
					onDoubleClick={() => { this.setState({ editMode: EditMode.Name }) } }>
					{(() => {
						if (this.state.editMode !== EditMode.Name)
							return (<b>{this.state.prettyName}</b>);
						else
						{
							return (
								<TextField
										autoFocus
										value	={this.state.prettyName}
										onChange={(e) => this.applyChange(EditMode.Name, e.target.value) }
										onBlur	={() => { this.setState({ editMode: EditMode.None }) } }
									/>
							);
						}
					})()}
				</Grid>
				<Grid item xs={3} {...center}
					onDoubleClick={() => { this.setState({ editMode: EditMode.Invoc }) } }>
					{(() => {
						if (this.state.editMode !== EditMode.Invoc)
							return (<tt>{this.state.invoc}</tt>);
						else
						{
							return (
								<TextField
										autoFocus
										value	={this.state.invoc}
										onChange={(e) => this.applyChange(EditMode.Invoc, e.target.value)}
										onBlur	={() => { this.setState({ editMode: EditMode.None }) } }
									/>
							);
						}
					})()}
				</Grid>
				<Grid item xs={3} {...center}>
					{this.state.value}					
				</Grid>
				<Grid item xs={3} onClick={() => this.props.onRequestColorEditor(this.colorFieldRef.current)}>
					<div ref={this.colorFieldRef} style={ { width: "100%", height: "40px", backgroundColor: `#${this.state.value}` } }></div>
				</Grid>
			</Grid>
		);
	}
}