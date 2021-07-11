import React from 'react';

import { download } from './js/DownloadStringToFile';

import {
	BrowserRouter as Router,
	// Switch,
	// Route,
	// Link as RouteLink,
	// useHistory
} from "react-router-dom";

import clsx from 'clsx';

import DesignerContent from './components/DesignerContent';

import {
	Drawer,         AppBar,             Toolbar,
	List,           CssBaseline,        Typography,
	Divider,        IconButton,         ListItem,
	ListItemIcon,   ListItemText,       Tooltip,
} from '@material-ui/core';

import {
	// makeStyles,
	withStyles,
	// useTheme
} from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SaveIcon from '@material-ui/icons/Save';
import LoadIcon from '@material-ui/icons/CloudUpload';

import ChatIcon from '@material-ui/icons/Chat';
import DialogIcon from '@material-ui/icons/ListAlt';

import CustomDialog from './components/CustomDialog';

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
			}
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
			}
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
					download('chat.json', this.designer.generateJsonContent())
				},
				icon: SaveIcon
			}
		];

		this.loadFile = () => {
				
				let file = document.getElementById("LoadFileInput").files[0];
				if (file.type === "application/json") {
						let reader = new FileReader();

						reader.onload = () => {
								this.designer.loadFromJson(reader.result);
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
							<IconButton onClick={this.handleDrawerClose}>
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
					<DesignerContent
						customRef={ref => { this.designer = ref } }
						onError={(title, content) => this.displayDialog(title, content)}
						/>
					<CustomDialog title={this.state.dialog.title} ref={ (ref) => this.dialog.ref = ref }>
						{this.state.dialog.content}
					</CustomDialog>
				</div>
			</Router>
		);
	}
}

export default withStyles(useStyles)(App);