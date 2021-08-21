import React from 'react';

import { v4 as uuidv4 } from 'uuid';

export const defaultLanguages = [
	{ id: uuidv4(), name: "Polish" },
	{ id: uuidv4(), name: "English" },
];

const LangsContext = React.createContext( {
	langs: 		defaultLanguages,
	setLangs: 	() => {}
} );

export default LangsContext;

