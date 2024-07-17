import { useColourContrast } from '~/context';
import { Text } from '../text/text';

import styles from './range-input.module.css';
import clsx from 'clsx';

export type TRangeInput = {
	id: string;
	labelText: string;
} & Pick<
	React.ComponentProps<'input'>,
	'max' | 'name' | 'property' | 'step' | 'value' | 'onChange'
>;

export const RangeInput: React.FC<TRangeInput> = ({
	id,
	labelText,
	max,
	name,
	property,
	step,
	value,
	onChange,
}) => {
	const { isPoorContrastOnLightBg, isPoorContrastOnDarkBg } =
		useColourContrast();

	return (
		<div className={styles.field}>
			<label
				htmlFor={id}
				className={clsx(
					styles.label,
					isPoorContrastOnLightBg ? styles.labelDark : undefined,
					isPoorContrastOnDarkBg ? styles.labelLight : undefined,
				)}
			>
				<Text size="pulse" weight="semiBold" role="presentation">
					{labelText}
				</Text>
			</label>

			<input
				id={id}
				type="range"
				max={max}
				name={name ?? id}
				property={property}
				step={step}
				value={value}
				onChange={onChange}
				className={clsx(
					styles.input,
					isPoorContrastOnLightBg ? styles.inputDark : undefined,
					isPoorContrastOnDarkBg ? styles.inputLight : undefined,
				)}
			/>
		</div>
	);
};
