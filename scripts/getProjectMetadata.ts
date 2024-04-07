/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Built In Detroit Project Contributors. All rights reserved.
 *  Licensed under the Apache 2.0 License.
 *--------------------------------------------------------------------------------------------*/

import chalk from 'chalk';
import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { ProjectMetadataSchema } from './ProjectMetadataSchema';
import { getProjectRootPath } from './paths';

/**
 * Returns the data of the "meta.json" file for the project.
 */
export function getProjectMetadata(): ProjectMetadataSchema {
	const absProjectMetaJsonPath = join(getProjectRootPath(), 'meta.json');

	try {
		const decoder = new TextDecoder('utf-8');
		const projectMetaJsonData = readFileSync(absProjectMetaJsonPath);
		return JSON.parse(decoder.decode(projectMetaJsonData));
	} catch (err) {
		console.error(chalk.bold.red(`Could not read the "meta.json" file: ${err}`));
		process.exit(1);
	}
}
