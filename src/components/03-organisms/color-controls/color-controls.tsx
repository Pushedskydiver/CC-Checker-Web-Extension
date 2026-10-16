import { useState } from 'react';

import { useColourContrast } from '~/context';
import { colorToHsl, hslToHex } from '~/utils/color-utils';
import { toCompleteHex } from '~/utils/parse-color-input';
import { TextInput } from '~/components/01-atoms/text-input/text-input';
import { ColourControl } from '~/components/02-molecules/color-control/color-control';
import { Tabbed } from '../tabbed/tabbed';

import styles from './color-controls.module.css';

import type { TColorKey } from '~/global-types';

export const ColorControls = () => {
	const { background, foreground, setColor } = useColourContrast();

	// While the user is typing, the input shows their draft; otherwise it shows
	// the canonical hex of the current colour.
	const [bgDraft, setBgDraft] = useState<string | null>(null);
	const [fgDraft, setFgDraft] = useState<string | null>(null);

	const drafts: Record<TColorKey, string | null> = {
		background: bgDraft,
		foreground: fgDraft,
	};
	const setDraft: Record<TColorKey, (value: string | null) => void> = {
		background: setBgDraft,
		foreground: setFgDraft,
	};
	const hex: Record<TColorKey, string> = {
		background: hslToHex(background),
		foreground: hslToHex(foreground),
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const name = e.target.id as TColorKey;
		const complete = toCompleteHex(e.target.value);

		if (complete === null) {
			setDraft[name](e.target.value);
			return;
		}

		setDraft[name](null);
		setColor(name, colorToHsl(complete));
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
		setDraft[e.target.id as TColorKey](null);
	};

	return (
		<>
			<section
				className={styles.control}
				aria-label="Background colour controls"
			>
				<TextInput
					id="background"
					labelText="Background colour"
					minLength={7}
					value={drafts.background ?? hex.background}
					onChange={handleChange}
					onBlur={handleBlur}
				/>

				<Tabbed
					id="background-tabs"
					ariaLabel="Background colour controls"
					items={[
						{
							id: 'rgb-background',
							name: 'RGB',
							children: (
								<ColourControl id="background" type="rgb" />
							),
						},
						{
							id: 'hsl-background',
							name: 'HSL',
							children: <ColourControl id="background" />,
						},
					]}
				/>
			</section>

			<section
				className={styles.control}
				aria-label="Foreground colour controls"
			>
				<TextInput
					id="foreground"
					labelText="Foreground colour"
					minLength={7}
					value={drafts.foreground ?? hex.foreground}
					onChange={handleChange}
					onBlur={handleBlur}
				/>

				<Tabbed
					id="foreground-tabs"
					ariaLabel="Foreground colour controls"
					items={[
						{
							id: 'rgb-foreground',
							name: 'RGB',
							children: (
								<ColourControl id="foreground" type="rgb" />
							),
						},
						{
							id: 'hsl-foreground',
							name: 'HSL',
							children: <ColourControl id="foreground" />,
						},
					]}
				/>
			</section>
		</>
	);
};
