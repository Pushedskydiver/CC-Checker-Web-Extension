import { Text } from '~/components/01-atoms/text/text';

import styles from '../tabbed.module.css';

export type TTab = {
	id: string;
	index: number;
	name: string;
	activeTab: number;
	tabRef: React.RefObject<{ [key: number]: HTMLElement | null }>;
	handleTabClick: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		index: number,
	) => void;
	handleTabKeyDown: (
		e: React.KeyboardEvent<HTMLAnchorElement>,
		orientation: 'horizontal' | 'vertical',
	) => void;
};

export const Tab = ({
	id,
	index,
	name,
	activeTab,
	tabRef,
	handleTabClick,
	handleTabKeyDown,
}: TTab) => {
	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
		handleTabClick(e, index);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>): void => {
		handleTabKeyDown(e, 'horizontal');
	};

	return (
		<li className={styles.item} role="presentation">
			<a
				id={`tab-${id}`}
				href={`#panel-${id}`}
				role="tab"
				aria-selected={activeTab === index}
				aria-controls={`panel-${id}`}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				ref={(element) => {
					tabRef.current[index] = element;
				}}
				tabIndex={activeTab !== index ? -1 : undefined}
				className={styles.tab}
			>
				<Text size="pulse" weight="semiBold" role="presentation">
					{name}
				</Text>
			</a>
		</li>
	);
};
