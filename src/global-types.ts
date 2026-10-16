export type ColorTuple = [number, number, number];

export type TColors = {
	background: string;
	foreground: string;
};

export type TColorKey = keyof TColors;

export type TLevels = {
	AALarge: 'Pass' | 'Fail';
	AA: 'Pass' | 'Fail';
	AAALarge: 'Pass' | 'Fail';
	AAA: 'Pass' | 'Fail';
};

export type TPickedColor = {
	key: TColorKey;
	rgb: ColorTuple;
};
