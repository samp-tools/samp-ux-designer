import React from 'react';

// Various:
import { v4 as uuidv4 } from 'uuid';

// Material UI Components
import {
	Typography,
	TextField,
	Grid,
	Button,
} from '@material-ui/core';

// Material UI Styles
import { withStyles } 	from '@material-ui/core/styles';

// Material UI Icons:
import AddIcon 			from '@material-ui/icons/Add';
import SearchIcon 		from '@material-ui/icons/Search';

// [Custom] Contexts
import LangsCtx 		from '../contexts/LangsCtx';
import ChatMessagesCtx 	from '../contexts/ChatMessagesCtx';

// [Custom] Components
import SampChatEntry 	from './SampChatEntry';





const useStyles = theme => ({
	topContentBar: {
		alignItems: 'center',
	}
});

class ChatMessagesEditor
	extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			searchPattern: "",
		};

		this.error = (title, content) => this.props.onError(title, content);

		this.handleAddNewChatMessage = (msgsCtx, front) => {
			const entries = msgsCtx.messages;
			const newElem = { id: uuidv4(), content: "Chat message {FF0000}content..." };

			if (front)
				entries.unshift(newElem);
			else
				entries.push(newElem);

			msgsCtx.setMessages(entries);
		}

		this.ensureMessagesValid = (msgsCtx, langsCtx) => {

			if (langsCtx.langs.length === 0)
				return;

			let numChanged = 0;
			const msgs = msgsCtx.messages;
			for(let msg of msgs)
			{
				if (typeof msg.content == "string")
				{
					const prevContent = msg.content;

					msg.content = {};
					msg.content[`${langsCtx.langs[0].id}`] = {
						value: prevContent,
						enabled: true
					}

					++numChanged;
				}
			}

			if (numChanged > 0)
			{
				msgsCtx.setMessages(msgs);
			}
		};

		this.handleRemoveChatMessage = (msgsCtx, uuid) => {
			const entries = msgsCtx.messages.filter(entry => entry.id !== uuid);
			msgsCtx.setMessages(entries);
		}
		this.handleSearchPatternChanged = (e) => {
			this.setState( { searchPattern: e.target.value || "" } )
		}
		this.handleEntryChanged = (msgsCtx, entryIndex, newValue) => {
			const entries = msgsCtx.messages;
			entries[entryIndex].enumIdx = newValue.enumIdx || "";
			entries[entryIndex].content = newValue.content || "";
			msgsCtx.setMessages(entries);
		}
		
		this.moveEntry = (msgsCtx, entryIndex, newEntryIndex) =>
		{
			if (this.state.searchPattern !== "")
			{
				this.error("Move forbidden", ["Could not move if the ", <tt>filter</tt>, " is set.", <br/>, "Please remove the filter text first."]);
				return;
			}


			if (entryIndex < 0 || entryIndex >= msgsCtx.messages.length)
				return; // ignore
			
			if (newEntryIndex < 0 || newEntryIndex >= msgsCtx.messages.length)
				return; // ignore
			
			const entries = msgsCtx.messages;
			entries.splice(newEntryIndex, 0, entries.splice(entryIndex, 1)[0]);

			msgsCtx.setMessages(entries);
		}

		this.getEntryElements = (msgsCtx) => {
			const entries = msgsCtx.messages;
			const p = this.state.searchPattern;
			const filtered = p !== "" ? entries.filter(e => (e.enumIdx || "").toLowerCase().indexOf(p.toLowerCase()) !== -1) : entries;
			const result = filtered.map((entry, index) => (
				<SampChatEntry
						key			={entry.id}
						enumIdx		={entry.enumIdx}
						content		={entry.content}
						onChange	={(val)	=> this.handleEntryChanged(msgsCtx, index, val)}
						onRemoved	={()	=> this.handleRemoveChatMessage(msgsCtx, entry.id)}
						onMovedUp	={()	=> this.moveEntry(msgsCtx, index, index - 1)}
						onMovedDown	={()	=> this.moveEntry(msgsCtx, index, index + 1)} />
			));

			if (result.length > 0)
				return result;
			else
				return (<Typography paragraph>No entries{entries.length > 0 ? ` that match pattern "${p}"` : ""}.</Typography>);
		};
	}

		

	render() {

		const { classes } = this.props;

		const addBtn = (msgsCtx, front = false) => (
			<Button style={ { marginBottom: 10, marginTop: 10 } } size="large" variant="contained" color="primary" startIcon={<AddIcon/>}
					onClick={() => this.handleAddNewChatMessage(msgsCtx, front)}
				>
				Add{front ? " to the top" : ""}
			</Button>
		);

		// const comp = ( {children} ) => (<pre>{children}</pre>);

		return (
			<ChatMessagesCtx.Consumer>
				{msgsCtx => (
					<LangsCtx.Consumer>
						{langsCtx => {
							this.ensureMessagesValid(msgsCtx, langsCtx);
							return (
								<div>
									{/* <Typography component={comp}>{`${JSON.stringify(msgsCtx, null, '\t')}`}</Typography>	 */}
									<Grid container spacing={2} className={classes.topContentBar}>
										<Grid item xs="auto">
											{addBtn(msgsCtx, true)}
										</Grid>
										<Grid item xs={10} sm={6} md={4} lg={2}>
											<TextField fullWidth InputProps={{ startAdornment: <SearchIcon/> }} placeholder="Filter by enum name"
													onChange={this.handleSearchPatternChanged}/>
										</Grid>
									</Grid>
									
									{this.getEntryElements(msgsCtx)}
									{addBtn(msgsCtx)}
								</div>
							);
						}}
					</LangsCtx.Consumer>
				)}
			</ChatMessagesCtx.Consumer>
		);
	}
}

export default withStyles(useStyles)(ChatMessagesEditor);