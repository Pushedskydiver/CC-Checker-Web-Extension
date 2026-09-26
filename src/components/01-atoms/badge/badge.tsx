import { Cross, Tick } from '../icon/icon';
import { Text } from '../text/text';

import styles from './badge.module.css';

export type TBadge = {
	type: 'AA Large' | 'AAA Large' | 'AA Normal' | 'AAA Normal';
	grade: 'Pass' | 'Fail';
	children: React.ReactNode;
};

export const Badge = ({ grade, type, children }: TBadge) => {
	const isPass = grade === 'Pass';

	return (
		<>
			<Text
				size="pulse"
				weight="medium"
				role="presentation"
				className={styles.badge}
			>
				<span role="presentation">{children}</span>

				{isPass ? <Tick /> : <Cross />}
			</Text>

			<Text
				size="whisper"
				weight="medium"
				role="presentation"
				className={styles.badgeText}
			>
				{type}
			</Text>
		</>
	);
};
