import { useState } from 'react';
import { useColourContrast } from '~/context';
import { ActionCta } from '../../01-atoms/action-cta/action-cta';
import { Save } from '../../01-atoms/icon/icon';
import { Tooltip } from '../../01-atoms/tooltip/tooltip';

import styles from './save-colors-cta.module.css';

export const SaveColorsCta: React.FC = () => {
	const [isSaved, setIsSaved] = useState(false);
	const { saveColors } = useColourContrast();

	const bodyText = isSaved ? 'Colours saved' : 'Save colours';

	const setIsSavedState = (): void => {
		setIsSaved(true);
		saveColors();

		const delaySetState = setTimeout(() => {
			setIsSaved(false);
			clearTimeout(delaySetState);
		}, 2000);
	};

	return (
		<span className={styles.ctaWrapper}>
			<Tooltip
				bodyText={bodyText}
				position="bottom"
				showTooltip={isSaved}
			/>

			<ActionCta
				label={bodyText}
				onClick={setIsSavedState}
				icon={<Save size={20} />}
				withBackground={true}
				className={styles.cta}
			/>
		</span>
	);
};
