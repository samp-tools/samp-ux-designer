import React from 'react';

import { v4 as uuidv4 } from 'uuid';

export const defaultPalette = [
	{ id: uuidv4(), prettyName: "Dollarbill", 	invoc: "Dollar", 	value: "85bb65" },
	{ id: uuidv4(), prettyName: "Error", 		invoc: "Error", 	value: "ee0000" },
	{ id: uuidv4(), prettyName: "Disabled", 	invoc: "Disabled", 	value: "979aaa" },
];

const PaletteContext = React.createContext( {
	palette: 	defaultPalette,
	setPalette: () => {}
} );

export default PaletteContext;

