import { ColorPickerCta } from '../color-picker-cta/color-picker-cta';
import { CopyCta } from '../copy-cta/copy-cta';
import { Text } from '../text/text';

import styles from './text-input.module.css';

export type TTextInput = {
	id: 'background' | 'foreground';
	labelText: string;
	value: string;
} & Pick<
	React.ComponentProps<'input'>,
	'minLength' | 'name' | 'onChange' | 'onBlur'
>;

export const TextInput = ({
	id,
	labelText,
	minLength,
	name,
	value,
	onChange,
	onBlur,
}: TTextInput) => {
	return (
		<div className={styles.field}>
			<label htmlFor={id} className={styles.label}>
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
					onBlur={onBlur}
					className={styles.input}
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
