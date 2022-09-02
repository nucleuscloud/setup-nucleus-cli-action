import os from 'os';
import core from '@actions/core';
import path from 'path';
import tc from '@actions/tool-cache';

import { isError, getDownloadObject, mapArch, mapOs } from './utils';

export async function setup(): Promise<any> {
  try {
    // Gather Github Actions inputs
    const version = core.getInput('nucleus_version');
    const apiToken = core.getInput('api_token');

    // Gather OS details
    const osPlatform = os.platform();
    const osArch = os.arch();

    core.debug(`Finding releases for Nucleus version ${version}`);

    // Get nucleus release
    const { url, binPath } = getDownloadObject(
      version,
      mapOs(osPlatform),
      mapArch(osArch)
    );

    // Download requested version
    core.debug(`Download Nucleus CLI from ${url}`);
    const pathToTarball = await tc.downloadTool(url);
    core.debug('Extracting Nucleus CLI from tar');
    const pathToCli = path.join(await tc.extractTar(pathToTarball), binPath);

    core.addPath(pathToCli);
    core.debug(`Nucleus CLI path is ${pathToCli}`);

    // todo: add api key to ~/.nucleus/auth.json
  } catch (error) {
    if (isError(error)) {
      core.error(error);
      throw error;
    }
    throw error;
  }
}
