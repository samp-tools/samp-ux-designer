import React from 'react';

// React router:
import {
	BrowserRouter as Router,
} from "react-router-dom";

// Various:
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

// Material UI Components
import {
	Drawer,         AppBar,             Toolbar,
	List,           CssBaseline,        Typography,
	Divider,        IconButton,         ListItem,
	ListItemIcon,   ListItemText,       Tooltip,
} from '@material-ui/core';

// Material UI Styles
import { withStyles } 	from '@material-ui/core/styles';

// Material UI Icons:
import {
	Menu			as MenuIcon,
	ChevronLeft		as ChevronLeftIcon,
	Save			as SaveIcon,
	CloudUpload		as LoadIcon,
	Translate		as TranslateIcon,
	Palette			as PaletteIcon,
	Chat			as ChatIcon,
	ListAlt			as DialogIcon,
} from '@material-ui/icons';


// [Custom] Contexts:
import LangsCtx, { defaultLanguages } 		from './contexts/LangsCtx';
import ChatMessagesCtx, { defaultMessages } from './contexts/ChatMessagesCtx';
import PaletteCtx, { defaultPalette } 		from './contexts/PaletteCtx';

// [Custom] Components:
import CustomDialog 	from './components/CustomDialog';
import DesignerContent 	from './components/DesignerContent';

// [Custom] Scripts:
import { download }				from './js/DownloadStringToFile';
import { processChatString }	from './js/ProcessChatString';


const drawerWidth = 240;


const useStyles = theme => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1,
		},
	},
	toolbar: {
		height: "65px",
		"& .ToolbarButton": {
			height: "100%",
			width: "70px"
		}
	}
});



class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false,
			toolIndex: 0,
			dialog: {
				title: "",
				content: ""
			},
			chatMessagesCtx: {
				messages: defaultMessages,

				setMessages: (value) => {
					this.setState(prevState => (
						{
							chatMessagesCtx: {
								...prevState.chatMessagesCtx,
								messages: value
							}
						}
					));
				},
				addMessage: (front = false, cnt = '') => {
					const newUuid = uuidv4();
					const newMsg = {
						id: newUuid,
						content: cnt
					};
					
					if (front)
					{
						this.setState(prevState => ({
							chatMessagesCtx: {
								...prevState.chatMessagesCtx,
								messages: [ newMsg, ...prevState.chatMessagesCtx.messages ],
							},
						}));
					}
					else
					{
						this.setState(prevState => ({
							chatMessagesCtx: {
								...prevState.chatMessagesCtx,
								messages: [ ...prevState.chatMessagesCtx.messages, newMsg ],
							},
						}));
					}
					return newUuid;
				},
				updateMessage: (uid, newCppName, newValue) => {
					const idx = this.state.chatMessagesCtx.messages.findIndex(cm => cm.id === uid);
					if (idx === -1)
						return;

					const msgs = [...this.state.chatMessagesCtx.messages];
					msgs[idx].cppName = newCppName;
					msgs[idx].content = newValue;

					this.setState(prevState => ({
						chatMessagesCtx: {
							...prevState.chatMessagesCtx,
							messages: msgs
						},
					}));
				}
			},
			langsCtx: {
				langs: defaultLanguages,

				setLangs: (value) => {
					this.setState(prevState => ({
						langsCtx: {
							...prevState.langsCtx,
							langs: value
						}
					}));
				}
			},
			paletteCtx: {
				palette: defaultPalette,

				setPalette: (value) => {
					this.setState(prevState => ({
						paletteCtx: {
							...prevState.paletteCtx,
							palette: value
						}
					}));
				}
			},
		};

		this.dialog = {};

		this.tools = [
			{
				name: "Chat messages",
				url: "/chat",
				icon: ChatIcon
			},
			{
				name: "Dialogs",
				url: "/dialog",
				icon: DialogIcon
			},
			{
				name: "Languages",
				url: "/lang",
				icon: TranslateIcon
			},
			{
				name: "Palette",
				url: "/palette",
				icon: PaletteIcon
			},
		];

		this.displayDialog = (title, content) => {
			this.setState( { dialog: { title, content } } );
			this.dialog.ref.setOpen(true);
		}

		this.actions = [
			{
				name: "Load (from JSON)",
				clickHandler: () => { 
					this.upload.click();
				},
				icon: LoadIcon
			},
			{
				name: "Save (to JSON)",
				clickHandler: () => { 
					download('chat.json', this.generateJsonContent())
				},
				icon: SaveIcon
			}
		];

		this.loadFile = () => {
				
				let file = document.getElementById("LoadFileInput").files[0];
				if (file.type === "application/json") {
						let reader = new FileReader();

						reader.onload = () => {
								this.loadFromJson(reader.result);
						}

						reader.readAsText(file);
				} else {
					this.displayDialog(
						"Invalid file",
						[ "You specified file with a invalid format. Only ", <tt>".json"</tt>, " files are supported." ]
					);
				}
				document.getElementById("LoadFileInput").value = "";
		}


		this.handleToolSelected = this.handleToolSelected.bind(this);
		this.handleDrawerOpen   = this.handleDrawerOpen.bind(this);
		this.handleDrawerClose  = this.handleDrawerClose.bind(this);

		this.generateJsonContent = () =>
		{
			const makeContent = content => {
				if (!content) return "";

				const processedContent = {};
				for (const key in content)
				{
					const v = content[key];
					const generated = processChatString(v.value, this.state.paletteCtx.palette, {});
					processedContent[key] = {
						value:		v.value,
						comment:	generated.comment,
						processed:	generated.cppFormat,
						enabled:	v.enabled,
					};
				}
				return processedContent;
			};

			return JSON.stringify(
				{
					languages:		this.state.langsCtx.langs,
					palette: 		this.state.paletteCtx.palette
						.map(c => (
							{
								prettyName:	c.prettyName,
								invocation:	c.invoc,
								value:		c.value
							}
						)),
					chatMessages:	this.state.chatMessagesCtx.messages
						.map(e => (
							{
								uniqueName:	e.cppName || "",
								content:	makeContent(e.content)
							}
						))
				},
				null, '\t'
			);
		}
	
		this.loadFromJson = (jsonContent) => {
			const jc = JSON.parse(jsonContent);

			this.state.langsCtx.setLangs(
				jc.languages.map(l => (
					{
						id:		l.id,
						name:	l.name
					}
				))
			);

			// This is not necessary
			if (jc.palette)
			{
				this.state.paletteCtx.setPalette(
					jc.palette.map(c => (
						{
							id:			uuidv4(),
							prettyName:	c.prettyName,
							invoc:		c.invoc,
							value:		c.value
						}
					))
				);
			}

			this.state.chatMessagesCtx.setMessages(
				jc.chatMessages.map(cm => (
					{
						id: 		uuidv4(),
						cppName:	cm.uniqueName	|| "",
						content:	cm.content		|| ""
					}
				))
			);
		}
	}

	setOpen(open)     { this.setState({ open }); }
	setTool(toolIdx)  { this.setState({ toolIndex: toolIdx }); }

	handleToolSelected(toolIdx) {
		this.designer.enterUrl(this.tools[toolIdx].url);
		this.setTool(toolIdx);
	}

	handleDrawerOpen() {
		this.setOpen(true);
	}

	handleDrawerClose() {
		this.setOpen(false);
	}

	render()
	{
		const { classes } = this.props;

		return (
			<Router>
				<div className={classes.root}>
					<CssBaseline />
					<AppBar
						position="fixed"
						className={clsx(classes.appBar, {
							[classes.appBarShift]: this.state.open,
						})}
					>
						<Toolbar>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={this.handleDrawerOpen}
								edge="start"
								className={clsx(classes.menuButton, {
									[classes.hide]: this.state.open,
								})}
							>
								<MenuIcon />
							</IconButton>
							<Typography variant="h6" noWrap>
								SAMP UX Designer - {this.tools[this.state.toolIndex].name}
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						variant="permanent"
						className={clsx(classes.drawer, {
							[classes.drawerOpen]: this.state.open,
							[classes.drawerClose]: !this.state.open,
						})}
						classes={{
							paper: clsx({
								[classes.drawerOpen]: this.state.open,
								[classes.drawerClose]: !this.state.open,
							}),
						}}
					>
						<div className={classes.toolbar}>
							<IconButton className="ToolbarButton" onClick={this.handleDrawerClose}>
								<ChevronLeftIcon />
							</IconButton>
						</div>
						<Divider />
						<List>
							{this.tools.map((tool, index) => (
								<Tooltip title={tool.name} arrow placement="right">
									<ListItem button key={tool.name} onClick={() => this.handleToolSelected(index)}>
										<ListItemIcon>{React.createElement(tool.icon)}</ListItemIcon>
										<ListItemText primary={tool.name} tooltip={tool.name}/>
									</ListItem>
								</Tooltip>
							))}
						</List>
						<Divider />
						<input id="LoadFileInput" type="file" ref={(ref) => this.upload = ref} style={{ display: 'none' }}
								onChange={this.loadFile}
							/>
						<List>
							{this.actions.map((action, index) => (
								<Tooltip title={action.name} arrow placement="right">
									<ListItem button key={action.name} onClick={action.clickHandler}>
										<ListItemIcon>{React.createElement(action.icon)}</ListItemIcon>
										<ListItemText primary={action.name} />
									</ListItem>
								</Tooltip>
							))}
						</List>
					</Drawer>
					<ChatMessagesCtx.Provider value={this.state.chatMessagesCtx}>
					<LangsCtx.Provider value={this.state.langsCtx} >
					<PaletteCtx.Provider value={this.state.paletteCtx} >
						<DesignerContent
								customRef={ref => { this.designer = ref } }
								onError={(title, content) => this.displayDialog(title, content)}
							/>
					</PaletteCtx.Provider>
					</LangsCtx.Provider>
					</ChatMessagesCtx.Provider>
					<CustomDialog title={this.state.dialog.title} ref={ (ref) => this.dialog.ref = ref }>
						{this.state.dialog.content}
					</CustomDialog>
				</div>
			</Router>
		);
	}
}

export default withStyles(useStyles)(App);