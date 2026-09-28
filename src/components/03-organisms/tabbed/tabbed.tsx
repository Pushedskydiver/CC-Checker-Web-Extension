import { useTabbed } from '~/hooks/useTabbed';
import { Tab } from './components/tab';
import { Panel } from './components/panel';

import styles from './tabbed.module.css';

export type TTabbedItem = {
	id: string;
	name: string;
	children: React.ReactNode;
};

export type TTabbed = {
	id: string;
	items: TTabbedItem[];
	ariaLabel?: string;
	orientation?: 'horizontal' | 'vertical';
};

export const Tabbed = ({
	id,
	items,
	ariaLabel,
	orientation = 'horizontal',
}: TTabbed) => {
	const {
		activeTab,
		tabItemRefs,
		tabPanelRefs,
		handleTabClick,
		handleTabKeyDown,
	} = useTabbed();

	return (
		<div className={styles.tabs}>
			<ul
				id={id}
				className={styles.list}
				role="tablist"
				aria-orientation={orientation}
				aria-label={ariaLabel}
			>
				{items.map((item, index) => (
					<Tab
						key={`${item.id}-tab`}
						id={item.id}
						index={index}
						name={item.name}
						tabRef={tabItemRefs}
						activeTab={activeTab}
						handleTabClick={handleTabClick}
						handleTabKeyDown={handleTabKeyDown}
					/>
				))}
			</ul>

			{items.map((item, index) => (
				<Panel
					key={`${item.id}-panel`}
					id={item.id}
					index={index}
					activeTab={activeTab}
					panelRef={tabPanelRefs}
				>
					{item.children}
				</Panel>
			))}
		</div>
	);
};
