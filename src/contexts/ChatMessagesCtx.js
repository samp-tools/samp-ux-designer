import React from 'react';

import { v4 as uuidv4 } from 'uuid';

export const defaultMessages = [
	{ id: uuidv4(), cppName: "Healed", content: "{00FF00}You {CCFFCC}healed yourself {00FF00}for free!" },
	{ id: uuidv4(), cppName: "Welcome", content: "Welcome to the {FF0000}Gold {FFFF00}Party {00CCFF}Polska {FFFFFF}server!" },
];

const ChatMessagesContext = React.createContext( {
	messages: 		defaultMessages,
	setMessages: 	() => {}
} );

export default ChatMessagesContext;

