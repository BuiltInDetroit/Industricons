/* eslint-disable header/header */
/*---------------------------------------------------------------------------------------------
 *  Copyright IBM Corp. 2018, 2018
 *  Copyright (c) Built In Detroit Project Contributors. All rights reserved.
 *  Licensed under the Apache 2.0 License.
 *--------------------------------------------------------------------------------------------*/

import chalk from 'chalk';
import { FontAssetType, OtherAssetType, generateFonts } from 'fantasticon';
import { copyFileSync, mkdirSync, readFileSync, removeSync, writeFileSync } from 'fs-extra';
import { basename, join } from 'path';
import SVGSpriter from 'svg-sprite';
import { Config as SvgoConfig, optimize } from 'svgo';
import { getDirContentsInfo } from './getDirContentsInfo';
import { getProjectMetadata } from './getProjectMetadata';
import { getDistRootPath, getSrcRootPath } from './paths';

type GlyphCodepoint = number;

const encoder = new TextEncoder();
const absDistLibPath = join(getDistRootPath(), '/lib');
const absIconsSrcDirPath = join(getSrcRootPath(), '/lib');
const absTemplatesDirPath = join(getSrcRootPath(), '/templates');
const glyphCodepointMappingFilePath = join(getSrcRootPath(), 'mapping.json');

let currentGlyphCodepoint: GlyphCodepoint = 60000;
// eslint-disable-next-line prefer-const
const glyphCodepointsMapping: { [glyphName: string]: GlyphCodepoint } = {};

const iconsSrcDirContentsInfo = getDirContentsInfo(absIconsSrcDirPath);

const fontBaseName = 'industricon';

iconsSrcDirContentsInfo.baseFileNames.forEach((iconBaseFilename) => {
	glyphCodepointsMapping[iconBaseFilename] = currentGlyphCodepoint;
	currentGlyphCodepoint += 1;
});

removeSync(getDistRootPath());

mkdirSync(getDistRootPath(), { recursive: true });

removeSync(glyphCodepointMappingFilePath);

writeFileSync(
	glyphCodepointMappingFilePath,
	encoder.encode(JSON.stringify(glyphCodepointsMapping, null, 2))
);

const svgoConfig: SvgoConfig = {
	plugins: [
		{
			name: 'removeAttrs',
			params: {
				attrs: 'fill',
			},
		},
		{
			name: 'addAttributesToSVGElement',
			params: {
				attributes: [
					{
						fill: 'currentColor',
					},
				],
			},
		},
	],
};

mkdirSync(absDistLibPath, { recursive: true });

iconsSrcDirContentsInfo.filePaths.forEach((iconFilePath) => {
	const optimizedSvgIconFilePath = join(absDistLibPath, basename(iconFilePath));
	optimizeSvgFile(iconFilePath, optimizedSvgIconFilePath, svgoConfig);
});

/**
 * Optimize a SVG file with SVGO per the specified configuration.
 * @param srcSvgFilePath The absolute path to the source (un-optimized) SVG file.
 * @param optimizedSvgFilePath The absolute path for the optimized SVG file.
 * @param svgoConfig The configuration for the SVGO optimization process.
 */
function optimizeSvgFile(
	srcSvgFilePath: string,
	optimizedSvgFilePath: string,
	svgoConfig: SvgoConfig
) {
	try {
		const decoder = new TextDecoder('utf-8');
		const originalSvgByteData = readFileSync(srcSvgFilePath);
		const originalSvgStringData = decoder.decode(originalSvgByteData);
		const optimizedSvgData = optimize(originalSvgStringData, svgoConfig).data.trim();
		writeFileSync(optimizedSvgFilePath, encoder.encode(optimizedSvgData));
	} catch (err) {
		console.error(chalk.bold.red(`Could not optimize the SVG file: ${err}`));
	}
}

const projectPackageJsonData = getProjectMetadata();

generateFonts({
	name: fontBaseName,
	fontTypes: [FontAssetType.TTF],
	assetTypes: [OtherAssetType.CSS, OtherAssetType.HTML],
	formatOptions: {
		ttf: {
			version: `${projectPackageJsonData.fontVersion}`,
			description: projectPackageJsonData.fontDescription || '',
		},
	},
	templates: {
		html: join(absTemplatesDirPath, 'preview.hbs'),
		css: join(absTemplatesDirPath, 'styles.hbs'),
	},
	codepoints: glyphCodepointsMapping,
	normalize: true,
	prefix: fontBaseName,
	inputDir: absDistLibPath,
	outputDir: getDistRootPath(),
})
	.catch((err) =>
		console.error(
			chalk.bold.red(
				`Could not generate the font assets and related assets for the SVG files: ${err}`
			)
		)
	)
	.then((_) => {
		const iconGalleryOriginalHtmlFilePath = join(getDistRootPath(), `${fontBaseName}.html`);
		const iconGalleryIndexHtmlFilePath = join(getDistRootPath(), 'index.html');

		// Add 'index.html' copy of 'industricon.html' output from the Fantasticon
		// generation process so that local HTTP servers and GitHub Pages picks it up
		// immediately.
		copyFileSync(iconGalleryOriginalHtmlFilePath, iconGalleryIndexHtmlFilePath);
	});

const spriter = new SVGSpriter({
	mode: {
		symbol: { dest: getDistRootPath(), sprite: `${fontBaseName}.svg` },
	},
});

const optimizedIconsDirContentsInfo = getDirContentsInfo(absDistLibPath);

optimizedIconsDirContentsInfo.filePaths.forEach((iconFilePath) => {
	const decoder = new TextDecoder('utf-8');
	const iconByteData = readFileSync(iconFilePath);
	const iconStringData = decoder.decode(iconByteData);
	spriter.add(iconFilePath, null, iconStringData);
});

type SpriterCompiledResource = {
	path: string | URL;
	contents: string;
};

type SpriterCompilationResult = {
	symbol: {
		sprite: SpriterCompiledResource;
	};
};

spriter.compile((err: any, result: SpriterCompilationResult) => {
	if (err) {
		console.error(chalk.bold.red(`SVG sprite compilation process was not successful: ${err}`));
	}

	try {
		writeFileSync(result.symbol.sprite.path, encoder.encode(result.symbol.sprite.contents));
	} catch (err) {
		console.error(chalk.bold.red(`Could not create the file containing inline sprites: ${err}`));
	}
});
