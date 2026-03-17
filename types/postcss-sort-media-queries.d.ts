declare module 'postcss-sort-media-queries' {
	interface Options {
		sort?: (a: string, b: string) => number;
	}
	export default function (opts?: Options): import('postcss').Plugin;
}
