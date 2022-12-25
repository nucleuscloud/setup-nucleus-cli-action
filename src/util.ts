import os from 'os';


// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function mapArch(arch: string) {
  const mappings: Record<string, string> = {
    x32: '386',
    x64: 'amd64'
  };
  return mappings[arch] || arch;
}

// os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
// return value in [darwin, linux, windows]
function mapOS(ops: string) {
  const mappings: Record<string, string> = {
    darwin: 'darwin',
    win32: 'windows'
  };
  return mappings[ops] || ops;
}


export function getDownloadUrl(version: string): string{
  const platform = os.platform();
  const filename = `nucleus_${ version }_${ mapOS(platform) }_${ mapArch(os.arch()) }`;
  const extension = 'tar.gz';
  return `https://github.com/cli/cli/releases/download/v${ version }/${ filename }.${ extension }`;
}

