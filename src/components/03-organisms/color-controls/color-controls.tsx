import { useEffect, useState } from 'react';
import { useColourContrast } from '~/context';
import { colorToHsl, hslToHex, isHex } from '~/utils/color-utils';
import { Pallette } from '~/components/01-atoms/icon/icon';
import { TextInput } from '~/components/01-atoms/text-input/text-input';
import { SaveColorsCta } from '~/components/02-molecules/save-colors-cta/save-colors-cta';
import { ColourControl } from '~/components/02-molecules/color-control/color-control';
import { SavedColors } from '~/components/02-molecules/saved-colors/saved-colors';
import { Tabbed } from '../tabbed/tabbed';

import styles from './color-controls.module.css';

export const ColorControls: React.FC = () => {
	const { background, colors, foreground, handleContrastCheck } =
		useColourContrast();

	const [bgValue, setBgValue] = useState(hslToHex(background));
	const [fgValue, setFgValue] = useState(hslToHex(foreground));

	const colorsLength = colors.length;
	const hasNoColors = colorsLength === 0;
	const colorsName = hasNoColors
		? 'My colours'
		: `My colours (${colorsLength})`;

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		let value = e.target.value;

		const name = e.target.id;
		const hslValue = isHex(value) ? colorToHsl(value) : null;
		const valueHasHash = value.indexOf('#') !== -1;
		const isHexCode = isHex(value);
		const isNum = /^\d+$/.test(value);
		const isShortHand = /(^#?[0-9a-f]{3,5}|[0-9a-f]{3])$/gim.test(value);
		const isRed = value.toLowerCase() === 'red';

		if (value.length >= 6 && !valueHasHash && isHexCode && isNum) {
			value = `#${value}`;
		}

		if (value.length <= 3 && !valueHasHash && !isRed) {
			return;
		}

		if (isShortHand && !isRed) {
			return;
		}

		if (value.length < 7 && !isHexCode) {
			return;
		}

		if (!isHexCode) {
			return;
		}

		if (!isShortHand && hslValue) {
			handleContrastCheck(hslValue, name);
		}
	};

	const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;

		setBgValue(value);
		handleOnChange(e);
	};

	const handleFgChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;

		setFgValue(value);
		handleOnChange(e);
	};

	useEffect(() => {
		setBgValue(hslToHex(background));
		setFgValue(hslToHex(foreground));
	}, [background, foreground]);

	return (
		<div className={styles.controls}>
			<div className={styles.foo}>
				<div className={styles.textInputs}>
					<TextInput
						id="background"
						labelText="Background colour"
						minLength={7}
						value={bgValue}
						onChange={handleBgChange}
					/>

					<TextInput
						id="foreground"
						labelText="Foreground colour"
						minLength={7}
						value={fgValue}
						onChange={handleFgChange}
					/>
				</div>

				<SaveColorsCta />
			</div>

			<Tabbed
				id="colour-range-tabs"
				ariaLabel="Colour range controls"
				items={[
					{
						id: 'rgb-controls',
						name: 'RGB',
						children: (
							<div className={styles.rangeInputs}>
								<ColourControl id="background-rgb" type="rgb" />
								<ColourControl id="foreground-rgb" type="rgb" />
							</div>
						),
					},
					{
						id: 'hsl-controls',
						name: 'HSL',
						children: (
							<div className={styles.rangeInputs}>
								<ColourControl id="background-hsl" />
								<ColourControl id="foreground-hsl" />
							</div>
						),
					},
					{
						id: 'saved-colors',
						name: colorsName,
						icon: <Pallette />,
						children: <SavedColors />,
					},
				]}
			/>
		</div>
	);
};
