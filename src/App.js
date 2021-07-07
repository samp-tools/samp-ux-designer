import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouteLink,
  useHistory
} from "react-router-dom";

import clsx from 'clsx';

import DesignerContent from './components/DesignerContent';

import {
  Drawer,        AppBar,        Toolbar,
  List,          CssBaseline,   Typography,
  Divider,       IconButton,    ListItem,
  ListItemIcon,  ListItemText,
} from '@material-ui/core';

import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

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
    };

    this.tools = [
      {
        name: "Chat messages",
        url: "/chat"
      },
      {
        name: "Dialogs",
        url: "/dialog"
      }
    ];

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
              {['Chat messages', 'Dialog'].map((text, index) => (
                <ListItem button key={text} onClick={() => this.handleToolSelected(index)}>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {['Save to JSON', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <DesignerContent customRef={ref => { this.designer = ref } } />
        </div>
      </Router>
    );
  }
}

export default withStyles(useStyles)(App);