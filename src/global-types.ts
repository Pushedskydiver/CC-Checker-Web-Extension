export type TColors = {
	background: string;
	foreground: string;
}

export type TLevels = {
	AALarge: 'Pass' | 'Fail';
	AA: 'Pass' | 'Fail';
	AAALarge: 'Pass' | 'Fail';
	AAA: 'Pass' | 'Fail';
}

export type TPickedColor = {
	key: keyof TColors;
	rgb: [number, number, number];
}
