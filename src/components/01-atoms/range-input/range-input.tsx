import clsx from 'clsx';

import { useColourContrast } from '~/context';
import { Text } from '../text/text';

import styles from './range-input.module.css';

export type TRangeInput = {
	id: string;
	labelText: string;
	/** Which channel of the colour tuple this slider edits. */
	channel: 0 | 1 | 2;
} & Pick<
	React.ComponentProps<'input'>,
	'min' | 'max' | 'name' | 'step' | 'value' | 'onChange'
>;

export const RangeInput = ({
	id,
	labelText,
	channel,
	// Without an explicit min the browser snaps values to steps counted from the
	// initial value, so a slider could never reach exactly 0 or 1.
	min = 0,
	max,
	name,
	step,
	value,
	onChange,
}: TRangeInput) => {
	const { isPoorContrast, isBackgroundDark } = useColourContrast();

	return (
		<div className={styles.field}>
			<label
				htmlFor={id}
				className={clsx(
					styles.label,
					isPoorContrast && !isBackgroundDark
						? styles.labelDark
						: undefined,
					isPoorContrast && isBackgroundDark
						? styles.labelLight
						: undefined,
				)}
			>
				<Text size="pulse" weight="medium" role="presentation">
					{labelText}
				</Text>
			</label>

			<input
				id={id}
				type="range"
				min={min}
				max={max}
				name={name ?? id}
				data-channel={channel}
				step={step}
				value={value}
				onChange={onChange}
				className={clsx(
					styles.input,
					isPoorContrast && !isBackgroundDark
						? styles.inputDark
						: undefined,
					isPoorContrast && isBackgroundDark
						? styles.inputLight
						: undefined,
				)}
			/>
		</div>
	);
};
