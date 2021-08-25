import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import {
	List,
	ListItem,
	IconButton,
	Grid,
	Popover,
	Button,
} from '@material-ui/core';

import {
	Add				as AddIcon,
	Delete			as DeleteIcon,
	ArrowUpward 	as UpIcon,
	ArrowDownward 	as DownIcon,
} from '@material-ui/icons';

// Material UI Extension Components:
import { ColorBox, createColor } from 'material-ui-color';

// [Custom] Components:
import PaletteColor	from './PaletteColor';
// [Custom] Contexts:
import PaletteCtx 	from '../contexts/PaletteCtx';

export default class PaletteEditor
	extends React.Component
{
	static contextType = PaletteCtx;

	constructor(props) {
		super(props);

		this.state = {

			currentEditUid:		null,
			currentEditColor:	createColor("#000000"),
			colorEditorAnchor:	null,
		}

		this.handleColorDeletion = (uid) => {
			const palette = [...this.context.palette];
			const idx = palette.findIndex(c => c.id === uid);
			if (idx === -1)
				return;
			palette.splice(idx, 1);
			this.context.setPalette(palette);
		}

		this.handleColorInfoChanged = (uid, val) => {
			const palette = [...this.context.palette];
			const idx = palette.findIndex(c => c.id === uid);
			if (idx === -1)
				return;

			palette[idx].prettyName = val.prettyName;
			palette[idx].invoc = val.invoc;
			this.context.setPalette(palette);
		}

		this.handleColorChanged = (newValue) => {
			const palette = [...this.context.palette];
			const idx = palette.findIndex(c => c.id === this.state.currentEditUid);

			palette[idx].value = newValue.hex.substring(0, 6);
			this.context.setPalette(palette);
			this.setState( { currentEditColor: newValue } );
		} 

		this.handleColorEditorRequest = (uid, anchor) =>
		{
			const palette = this.context.palette;
			const idx = palette.findIndex(c => c.id === uid);

			this.setState( {
				currentEditUid: 	uid,
				currentEditColor: 	createColor('#' + palette[idx].value),
				colorEditorAnchor: 	anchor,
			} );
		}

		this.handleAddNewColor = () => {
			const newColor = {
				id: 		uuidv4(),
				prettyName: "New color",
				invoc: 		"NewCol",
				value: 		"000000"
			};

			this.context.setPalette([...this.context.palette, newColor]);
		}

		this.moveEntry = (ctx, entryIndex, newEntryIndex) =>
		{
			if (entryIndex < 0 || entryIndex >= ctx.palette.length)
				return; // ignore
			
			if (newEntryIndex < 0 || newEntryIndex >= ctx.palette.length)
				return; // ignore
			
			const entries = ctx.palette;
			entries.splice(newEntryIndex, 0, entries.splice(entryIndex, 1)[0]);

			ctx.setPalette(entries);
		}

		this.handleMoveUp = (uid) => {
			const idx = this.context.palette.findIndex(c => c.id === uid);
			if (idx !== -1)
				this.moveEntry(this.context, idx, idx - 1);
		}
		this.handleMoveDown = (uid) => {
			const idx = this.context.palette.findIndex(c => c.id === uid);
			if (idx !== -1)
				this.moveEntry(this.context, idx, idx + 1);			
		}
	}

	render()
	{
		return (
			<div>
				<Grid container>
					<Grid item xs={12} md={6} lg={5} xl={4}>
						<List>
							{this.context.palette.map(c => (
								<ListItem divider button key={c.id}>
									<IconButton onClick={() => this.handleMoveUp(c.id)}><UpIcon/></IconButton>
									<IconButton onClick={() => this.handleMoveDown(c.id)}><DownIcon/></IconButton>
									<PaletteColor
											prettyName			={c.prettyName}
											invocation			={c.invoc}
											value				={c.value}
											onChange			={(val) => this.handleColorInfoChanged(c.id, val)}
											onRequestColorEditor={(anchor) => this.handleColorEditorRequest(c.id, anchor)}
										/>
									<IconButton onClick={() => this.handleColorDeletion(c.id)}><DeleteIcon/></IconButton>
								</ListItem>
							))}	
						</List>
					</Grid>
				</Grid>
				<Button style={ { marginBottom: 10, marginTop: 10 } }
						size="large" variant="contained" color="primary" startIcon={<AddIcon/>}
						onClick={() => this.handleAddNewColor()}
					>
					Add new
				</Button>
				<Popover open={this.state.currentEditUid !== null} anchorEl={() => this.state.colorEditorAnchor}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						onClose={(e) => {
							this.setState( { currentEditUid: null } );
							return true;
						}}

						disableAutoFocus={true}
						disableEnforceFocus={true}
						disableRestoreFocus={true}
					>
					<ColorBox
							disableAlpha
							value	={this.state.currentEditColor}
							onChange={this.handleColorChanged}
						/>
				</Popover>
				
			</div>
		);
	}
}