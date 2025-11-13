import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { imagesStorage } from './storage/resource';
import { generateThumb } from './functions/resize/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  imagesStorage,
  generateThumb
});
