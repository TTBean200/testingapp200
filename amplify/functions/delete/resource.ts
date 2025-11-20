import { defineFunction } from '@aws-amplify/backend';

export const deleteThumb = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'delete-image',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './onDeleteHandler.ts',

  bundling: {
    minify: false
  },
  timeoutSeconds: 60

});