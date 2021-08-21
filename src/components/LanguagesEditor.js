import React from 'react';

import AddIcon 		from '@material-ui/icons/Add';
import RemoveIcon 	from '@material-ui/icons/Delete';
import EditIcon 	from '@material-ui/icons/Edit';
import {
	TextField,
	Button,
	IconButton,
	List,
	ListItem,
	Typography,
	Grid,
} from '@material-ui/core';

import { v4 as uuidv4 } from 'uuid';


import LangsContext from '../contexts/LangsCtx';

export default class LanguagesEditor
	extends React.Component
{

	static contextType = LangsContext;

	constructor(props) {
		super(props);

		this.state = {
			editingUid: null,
			hoveredUuid: null
		};

		this.handleAddNewLanguage = () => {
			const langs = this.context.langs;
			const newUuid = uuidv4();
			langs.push( { id: newUuid, name: "New language" } );

			this.context.setLangs(langs);
			this.setState({ editingUid: newUuid });
		}

		this.handleLangNameChanged = (uuid, e) => {

			const idx = this.context.langs.findIndex(e => e.id === uuid);
			if (idx === -1)
				return;

			const langs = this.context.langs;
			langs[idx].name = e.target.value;

			this.context.setLangs(langs);
		}

		this.handleLangRemoved = (uuid) => {
			const filtered = this.context.langs.filter(e => e.id !== uuid);
			this.context.setLangs(filtered);
		}

		this.handleEditEntry = (uuid) => {
			this.setState( { editingUid: uuid });
		}


	}

	render() {
		// const comp = ({children}) => (<pre>{children}</pre>);
		return (
			<Grid container>
				<Grid item xs={12} md={4} lg={2}>
					{/* <Typography component={comp}>{`${JSON.stringify(this.context, null, '\t')}`}</Typography> */}
					<List>
						{this.context.langs.map((l, idx) => {
							let elem = null;
							if (l.id === this.state.editingUid)
								elem = (
									<TextField fullWidth variant="standard"
											value			={l.name || ""}
											onChange		={(val) => this.handleLangNameChanged(l.id, val)}
											onBlur			={() => { this.setState( { editingUid: null }) }}
											autoFocus
										/>);
							else
							{
								elem = (
									<Typography paragraph style={ { display: "flex", alignItems: "center", height: "100%" } }>
										{l.name}
										<IconButton variant="contained" color="primary"
												onClick={() => this.handleEditEntry(l.id) }
											>
											<EditIcon/>
										</IconButton>
										<IconButton variant="contained" color="primary"
												onClick={() => this.handleLangRemoved(l.id) }
											>
											<RemoveIcon/>
										</IconButton>
									</Typography>	
									);
							}
							
							return (
								<ListItem button key={l.id} style={ { alignItems: "center" } }>
									<Grid container>
										<Grid item xs={1}>
											<div style={ { fontSize: "120%", display: "flex", alignItems: "center", height: "100%" } }>{idx}.</div>
										</Grid>
										<Grid item xs={11}>
											{elem}
										</Grid>
									</Grid>
								</ListItem>
							);
						})}
						<Button style={ { marginBottom: 10, marginTop: 10 } } size="large" variant="contained" color="primary" startIcon={<AddIcon/>}
								onClick={() => this.handleAddNewLanguage()}
							>
							Add new
						</Button>
					</List>
				</Grid>
			</Grid>
		);
	}
}