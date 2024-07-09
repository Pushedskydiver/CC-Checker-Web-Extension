import clsx from 'clsx';
import { useColourContrast } from '~/context';
import { ColorPickerCta } from '../color-picker-cta/color-picker-cta';
import { CopyCta } from '../copy-cta/copy-cta';
import { Text } from '../text/text';

import styles from './text-input.module.css';

export type TTextInput = {
	id: 'background' | 'foreground';
	labelText: string;
	value: string;
} & Pick<React.ComponentProps<'input'>, 'minLength' | 'name' | 'onChange'>;

export const TextInput: React.FC<TTextInput> = ({
	id,
	labelText,
	minLength,
	name,
	value,
	onChange,
}) => {
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

			<Text
				tag="div"
				size="pinnacle"
				weight="medium"
				className={styles.inputWrapper}
			>
				<input
					id={id}
					type="text"
					minLength={minLength}
					name={name ?? id}
					spellCheck="false"
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

				<ul className={styles.list} aria-label={`${id} colour actions`}>
					<li>
						<ColorPickerCta id={id} />
					</li>

					<li>
						<CopyCta value={value} />
					</li>
				</ul>
			</Text>
		</div>
	);
};
