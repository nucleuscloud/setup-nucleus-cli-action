import core from '@actions/core';

import { setup } from './setup-nucleus';
import { isError } from './utils';

(async () => {
  try {
    await setup();
  } catch (error) {
    if (isError(error)) {
      core.setFailed(error.message);
    }
    console.error(error);
    core.setFailed('Unable to complete action setup');
  }
})();
