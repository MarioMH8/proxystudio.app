#!/usr/bin/env bun
/* eslint-disable no-console */
/*
 * generate-thumbs.ts
 *
 * Generates .thumb.png thumbnails for every source PNG found under `public/`.
 * Thumbnails preserve the alpha channel (transparent background).
 *
 * By default every image is scaled down so its longest side is 120 px,
 * preserving the original aspect ratio (fit: inside). This ensures that
 * wide images like PT boxes get a reasonable size instead of becoming tiny.
 *
 * Usage:
 *   bun run generate:thumbs                     # regenerate all thumbs under public/
 *   bun run generate:thumbs public/frames/m15   # regenerate thumbs in a specific subtree
 *   bun run generate:thumbs path/to/image.png   # regenerate thumb for a single file
 *
 * Options:
 *   --scale <0..1>   Scale factor relative to the source (overrides default)
 *   --width  <px>    Fixed max output width  (fit: inside, preserves aspect ratio)
 *   --height <px>    Fixed max output height (fit: inside, preserves aspect ratio)
 *   --help           Show this help message
 */

import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';

import sharp from 'sharp';

/*
 * Max side length for the default resize. Every image is scaled so its
 * longest side equals this value, preserving the aspect ratio (fit: inside).
 */
const DEFAULT_MAX_SIDE = 120;

/*
 * ANSI color helpers via Bun.color. Using "ansi" auto-detects the terminal
 * color depth and returns an empty string when colors are not supported.
 */
const RESET = '\u001B[0m';
const GREEN = Bun.color('#22c55e', 'ansi') ?? '';
const RED = Bun.color('#ef4444', 'ansi') ?? '';
const YELLOW = Bun.color('#eab308', 'ansi') ?? '';
const CYAN = Bun.color('#06b6d4', 'ansi') ?? '';
const DIM = '\u001B[2m';

const HELP_TEXT = `
Usage: bun run generate:thumbs [path...] [options]

Options:
  --scale <0..1>   Scale factor relative to the source (overrides default)
  --width  <px>    Fixed max output width  (fit: inside, preserves aspect ratio)
  --height <px>    Fixed max output height (fit: inside, preserves aspect ratio)
  --help           Show this help

Default: scale each image so its longest side is ${String(DEFAULT_MAX_SIDE)} px (fit: inside).
If no path is given, scans the whole public/ directory.
`.trim();

interface Options {
	height?: number;
	scale?: number;
	targets: string[];
	width?: number;
}

function parseArguments(): Options {
	const { positionals, values } = parseArgs({
		allowPositionals: true,
		args: Bun.argv,
		options: {
			height: { type: 'string' },
			help: { short: 'h', type: 'boolean' },
			scale: { type: 'string' },
			width: { type: 'string' },
		},
		strict: true,
	});

	if (values.help) {
		console.info(HELP_TEXT);
		process.exit(0);
	}

	const options: Options = { targets: positionals.slice(2) };

	if (values.scale !== undefined) {
		const scale = Number.parseFloat(values.scale);

		if (Number.isNaN(scale) || scale <= 0 || scale > 1) {
			console.error(`${RED}error${RESET}  --scale must be a number between 0 and 1`);
			process.exit(1);
		}

		options.scale = scale;
	}

	if (values.width !== undefined) {
		const width = Number.parseInt(values.width, 10);

		if (Number.isNaN(width) || width <= 0) {
			console.error(`${RED}error${RESET}  --width must be a positive integer`);
			process.exit(1);
		}

		options.width = width;
	}

	if (values.height !== undefined) {
		const height = Number.parseInt(values.height, 10);

		if (Number.isNaN(height) || height <= 0) {
			console.error(`${RED}error${RESET}  --height must be a positive integer`);
			process.exit(1);
		}

		options.height = height;
	}

	return options;
}

/*
 * Recursively collect all source PNG files (excluding .thumb.png) under the
 * given path (file or directory).
 */
async function collectSourcePngs(target: string): Promise<string[]> {
	const absolute = path.resolve(target);

	if (!existsSync(absolute)) {
		console.warn(`${YELLOW}warn${RESET}   path not found — ${absolute}`);

		return [];
	}

	if (statSync(absolute).isFile()) {
		if (path.extname(absolute).toLowerCase() === '.png' && !absolute.endsWith('.thumb.png')) {
			return [absolute];
		}

		console.warn(`${YELLOW}warn${RESET}   skipping non-source file — ${absolute}`);

		return [];
	}

	const glob = new Bun.Glob('**/*.png');
	const results: string[] = [];

	for await (const file of glob.scan({ absolute: true, cwd: absolute })) {
		if (!file.endsWith('.thumb.png')) {
			results.push(file);
		}
	}

	return results;
}

/*
 * Build the sharp resize options for a given source size and CLI options.
 * When a scale factor is given, both dimensions are multiplied (fit: fill).
 * Otherwise, the image fits inside a DEFAULT_MAX_SIDE × DEFAULT_MAX_SIDE box
 * (fit: inside), which keeps PT boxes and other wide images readable.
 */
function buildResizeOptions(
	sourceWidth: number | undefined,
	sourceHeight: number | undefined,
	options: Options
): sharp.ResizeOptions {
	if (options.scale !== undefined) {
		return {
			fit: 'fill',
			height: Math.max(1, Math.round((sourceHeight ?? 0) * options.scale)),
			width: Math.max(1, Math.round((sourceWidth ?? 0) * options.scale)),
		};
	}

	return {
		fit: 'inside',
		height: options.height ?? DEFAULT_MAX_SIDE,
		width: options.width ?? DEFAULT_MAX_SIDE,
		withoutEnlargement: true,
	};
}

/*
 * Generate a single .thumb.png next to the source file, preserving alpha.
 */
async function generateThumb(sourcePath: string, options: Options): Promise<void> {
	const thumbPath = path.join(path.dirname(sourcePath), `${path.basename(sourcePath, '.png')}.thumb.png`);

	const image = sharp(sourcePath).ensureAlpha();
	const metadata = await image.metadata();
	const resizeOptions = buildResizeOptions(metadata.width, metadata.height, options);

	await image.resize(resizeOptions).png({ compressionLevel: 9 }).toFile(thumbPath);

	const out = await sharp(thumbPath).metadata();
	const relativePath = thumbPath.replace(path.resolve('.'), '.');
	const dims = `${DIM}(${String(out.width)}×${String(out.height)})${RESET}`;

	console.info(`${GREEN}✓${RESET}  ${relativePath}  ${dims}`);
}

/*
 * Entry point
 */
const ROOT_PUBLIC = path.resolve(import.meta.dir, '..', 'public');

async function main(): Promise<void> {
	const options = parseArguments();
	const rawTargets = options.targets.length > 0 ? options.targets : [ROOT_PUBLIC];

	const sourceLists = await Promise.all(rawTargets.map(target => collectSourcePngs(target)));
	const allSources = sourceLists.flat();

	if (allSources.length === 0) {
		console.error(`${YELLOW}warn${RESET}   no source PNG files found`);
		process.exit(0);
	}

	console.info(`${CYAN}info${RESET}   generating ${String(allSources.length)} thumbnail(s)…\n`);

	let fail = 0;
	let ok = 0;

	await Promise.all(
		allSources.map(async source => {
			try {
				await generateThumb(source, options);
				ok++;
			} catch (error) {
				console.error(`${RED}✗${RESET}  ${source}\n   ${(error as Error).message}`);
				fail++;
			}
		})
	);

	const summary =
		fail > 0
			? `${GREEN}${String(ok)} generated${RESET}, ${RED}${String(fail)} failed${RESET}`
			: `${GREEN}${String(ok)} generated${RESET}`;

	console.info(`\n${CYAN}info${RESET}   done — ${summary}`);

	if (fail > 0) {
		process.exit(1);
	}
}

await main();
