import { useEffect, useEffectEvent } from 'react';

import { parsePickedColor } from '~/utils/parse-picked-color';

import type { TPickedColor } from '~/global-types';

/**
 * Listens for the eyedropper's `colorPicked` message, hands each valid pick to
 * `onPicked`, then tells the content script to close the picker.
 */
export const useColorPicked = (
	onPicked: (picked: TPickedColor) => void,
): void => {
	const handlePicked = useEffectEvent((picked: TPickedColor) => {
		onPicked(picked);

		chrome.runtime.sendMessage({
			type: 'closeColorPicker',
		});
	});

	useEffect(() => {
		function handleMessage(
			message: { type: string; key?: unknown; rgb?: unknown },
			sender: chrome.runtime.MessageSender,
		) {
			// The content script's broadcast and the service worker's relay both
			// arrive here. Only the relay reaches this iframe in incognito windows,
			// so that is the one handled; the direct copy (sender.tab set) is ignored.
			if (sender.tab) return;

			if (message.type !== 'colorPicked') return;

			// runtime.onMessage hears only this extension's own contexts, so an invalid
			// pick means content.js drifted. Dropped whole: no state change and no
			// closeColorPicker (Escape still closes the loupe).
			const picked = parsePickedColor(message);

			if (!picked) {
				console.warn(
					`Dropped a colorPicked message with an invalid payload: key=${JSON.stringify(message.key)} rgb=${JSON.stringify(message.rgb)}`,
				);

				return;
			}

			handlePicked(picked);
		}

		chrome.runtime.onMessage.addListener(handleMessage);

		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		};
	}, []);
};
