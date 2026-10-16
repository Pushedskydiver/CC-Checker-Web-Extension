import { useEffect, useRef } from 'react';

import { ActionCta } from '../action-cta/action-cta';
import { Eyedropper } from '../icon/icon';

import type { TColorKey } from '~/global-types';

export type TColorPickerCta = {
	id: TColorKey;
};

export const ColorPickerCta = ({ id }: TColorPickerCta) => {
	// One Escape listener at a time, removed on Escape, the next pick, or unmount.
	const escapeListener = useRef<AbortController | null>(null);

	useEffect(() => {
		return () => escapeListener.current?.abort();
	}, []);

	const capturePage = (): void => {
		escapeListener.current?.abort();

		const controller = new AbortController();

		escapeListener.current = controller;

		document.addEventListener(
			'keyup',
			(e: KeyboardEvent) => {
				if (e.key !== 'Escape') return;

				chrome.runtime.sendMessage({ type: 'closeColorPicker' });
				controller.abort();
			},
			{ signal: controller.signal },
		);

		chrome.runtime.sendMessage({
			type: 'getScreenshot',
			key: id,
		});
	};

	return (
		<ActionCta
			label={`Pick ${id} colour`}
			icon={<Eyedropper size={20} />}
			onClick={capturePage}
		/>
	);
};
