import React from 'react';

import {
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Checkbox,
} from '@material-ui/core'

// [Custom] Contexts:
import LangsCtx from '../contexts/LangsCtx';

class LanguageSelector
	extends React.Component
{
	static contextType = LangsCtx;

	constructor(props) {
		super(props);

		this.state = {
			shownLangs: this.props.shownLangs || []
		}

		this.langNameByUid = (uid) => {
			const idx = this.context.langs.findIndex(lang => lang.id === uid);
			if (idx !== -1)
				return this.context.langs[idx].name;
			
			return "Unknown";
		}

		this.handleToggle = (uid) => {
			const langs = this.state.shownLangs;

			const idx = langs.indexOf(uid)
			if (idx === -1)
				langs.push(uid);
			else
				langs.splice(idx, 1);

			if (this.props.onLanguageToggled)
				this.props.onLanguageToggled(uid, idx === -1);

			this.setState( { shownLangs: langs } );
		}
	}

	render() {
		return (
			<List>
				{this.context.langs.map(lang => {
					const labelId = `checkbox-list-label-${lang.id}`;

					return (
					  <ListItem key={lang.id} role={undefined} dense button onClick={() => this.handleToggle(lang.id)}>
						<ListItemIcon>
						  <Checkbox
							edge="start"
							checked={this.state.shownLangs.indexOf(lang.id) !== -1}
							tabIndex={-1}
							disableRipple
							inputProps={{ 'aria-labelledby': labelId }}
						  />
						</ListItemIcon>
						<ListItemText id={labelId} primary={`${lang.name}`} />
					  </ListItem>
					)
				})}
			</List>
		);
	}
}

export default LanguageSelector;