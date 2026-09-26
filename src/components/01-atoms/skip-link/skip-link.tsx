import styles from './skip-link.module.css';

export type TSkipLink = {
	href: string;
	bodyText: string;
};

export const SkipLink = ({ href, bodyText }: TSkipLink) => {
	return (
		<a href={href} className={styles.link}>
			{bodyText}
		</a>
	);
};
