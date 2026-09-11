import { useColourContrast } from '~/context';
import { hslToRgb, rgbToHsl, roundTo } from '~/utils/color-utils';
import { RangeInput } from '~/components/01-atoms/range-input/range-input';

import styles from './color-control.module.css';

import type { ColorTuple } from '~/global-types';

export type TColourControl = {
	id: 'background' | 'foreground';
	type?: 'hsl' | 'rgb';
};

const HSL_STEP = 1 / 256;

export const ColourControl: React.FC<TColourControl> = ({ id, type }) => {
	const { background, foreground, handleContrastCheck } = useColourContrast();

	const isRgb = type === 'rgb';
	const hsl = id === 'background' ? background : foreground;
	const value = isRgb ? hslToRgb(hsl) : hsl;

	// Labels are rounded for reading; the inputs get the raw value so the thumb
	// never snaps away from the stored colour.
	const labelTextA = isRgb
		? `Red ${value[0]}`
		: `Hue ${Math.round(value[0])}°`;
	const labelTextB = isRgb
		? `Green ${value[1]}`
		: `Saturation ${roundTo(value[1], 2)}`;
	const labelTextC = isRgb
		? `Blue ${value[2]}`
		: `Lightness ${roundTo(value[2], 2)}`;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const channel = Number(e.target.dataset.channel) as 0 | 1 | 2;
		const next: ColorTuple = [value[0], value[1], value[2]];

		next[channel] = parseFloat(e.target.value);

		handleContrastCheck(isRgb ? rgbToHsl(next) : next, id);
	};

	return (
		<div className={styles.control}>
			<RangeInput
				id={`${id}${isRgb ? 'Red' : 'Hue'}`}
				labelText={labelTextA}
				channel={0}
				max={isRgb ? 255 : 360}
				step={1}
				value={value[0]}
				onChange={handleChange}
			/>

			<RangeInput
				id={`${id}${isRgb ? 'Green' : 'Saturation'}`}
				labelText={labelTextB}
				channel={1}
				max={isRgb ? 255 : 1}
				step={isRgb ? 1 : HSL_STEP}
				value={value[1]}
				onChange={handleChange}
			/>

			<RangeInput
				id={`${id}${isRgb ? 'Blue' : 'Lightness'}`}
				labelText={labelTextC}
				channel={2}
				max={isRgb ? 255 : 1}
				step={isRgb ? 1 : HSL_STEP}
				value={value[2]}
				onChange={handleChange}
			/>
		</div>
	);
};
