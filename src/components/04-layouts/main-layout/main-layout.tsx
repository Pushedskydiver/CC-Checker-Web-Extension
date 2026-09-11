import styles from './main-layout.module.css';

export type TMainLayout = {
	children?: React.ReactNode;
};

export const MainLayout: React.FC<TMainLayout> = ({ children }) => (
	<main id="main">
		<div className={styles.container}>{children}</div>
	</main>
);
