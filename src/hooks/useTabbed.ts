import { useRef, useState } from 'react';

type TOrientation = 'horizontal' | 'vertical';

type TRefMap = React.RefObject<{ [key: number]: HTMLElement | null }>;

export type TUseTabbed = {
	activeTab: number;
	tabItemRefs: TRefMap;
	tabPanelRefs: TRefMap;
	handleTabClick: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		index: number,
	) => void;
	handleTabKeyDown: (
		e: React.KeyboardEvent<HTMLAnchorElement>,
		orientation: TOrientation,
	) => void;
};

export const useTabbed = (): TUseTabbed => {
	const [activeTab, setActiveTab] = useState(0);
	const tabItemRefs = useRef<{ [key: number]: HTMLElement | null }>({});
	const tabPanelRefs = useRef<{ [key: number]: HTMLElement | null }>({});

	const handleTabClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		index: number,
	): void => {
		e.preventDefault();

		setActiveTab(index);
	};

	const getTabCount = (): number =>
		Object.values(tabItemRefs.current).filter(Boolean).length;

	// WAI-ARIA tabs: arrow keys move focus and wrap, Home/End jump to the ends.
	const getNextIndex = (
		key: string,
		orientation: TOrientation,
	): number | undefined => {
		const isVertical = orientation === 'vertical';
		const next = isVertical ? 'ArrowDown' : 'ArrowRight';
		const previous = isVertical ? 'ArrowUp' : 'ArrowLeft';
		const count = getTabCount();

		if (count === 0) return undefined;

		switch (key) {
			case next:
				return (activeTab + 1) % count;
			case previous:
				return (activeTab - 1 + count) % count;
			case 'Home':
				return 0;
			case 'End':
				return count - 1;
			default:
				return undefined;
		}
	};

	const handleTabKeyDown = (
		e: React.KeyboardEvent<HTMLAnchorElement>,
		orientation: TOrientation,
	): void => {
		const toPanel = orientation === 'vertical' ? 'ArrowRight' : 'ArrowDown';

		if (e.key === toPanel) {
			e.preventDefault();
			tabPanelRefs.current[activeTab]?.focus();
			return;
		}

		const nextIndex = getNextIndex(e.key, orientation);

		if (nextIndex === undefined) return;

		e.preventDefault();
		setActiveTab(nextIndex);
		tabItemRefs.current[nextIndex]?.focus();
	};

	return {
		activeTab,
		tabItemRefs,
		tabPanelRefs,
		handleTabClick,
		handleTabKeyDown,
	};
};
