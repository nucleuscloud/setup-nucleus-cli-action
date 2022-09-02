import path from 'path';

const ARCH_MAPPINGS: Record<string, string> = {
  x32: '386',
  x64: 'amd64',
};

const OS_MAPPINGS: Record<string, string> = {
  darwin: 'macOs',
  win32: 'windows', // make sure this is legit
};

/**
 * os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
 * return value in [darwin, linux, windows]
 */
export function mapArch(arch: string): string {
  return ARCH_MAPPINGS[arch] || arch;
}

/**
 * os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
 * return value in [darwin, linux, windows]
 */
export function mapOs(operatingSystem: string): string {
  return OS_MAPPINGS[operatingSystem] || operatingSystem;
}

/**
 * Checks if the input value is an error or not.
 */
export function isError(item: unknown): item is Error {
  return item instanceof Error;
}

/**
 * Generates the download url and bin path based on the version and platform specific dependencies.
 */
export function getDownloadObject(
  version: string,
  platform: string,
  arch: string
): { url: string; binPath: string } {
  const filename = `nucleus_v${version}_${platform}_${arch}`;
  const extension = 'tar.gz';
  const binPath = platform === 'windows' ? 'bin' : path.join(filename, 'bin');
  const downloadUrl = `https://github.com/nucleuscloud/cli/releases/download/v${version}/${filename}.${extension}`;
  return {
    url: downloadUrl,
    binPath,
  };
}
