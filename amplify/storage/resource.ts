import { defineStorage } from "@aws-amplify/backend";
import { generateThumb } from '../functions/resize/resource'
import { deleteThumb } from "../functions/delete/resource";

export const imagesStorage = defineStorage({
    name: 'images',
    access: (allow) => ({
        'originals/*': [
            allow.resource(generateThumb).to(['read']),
            allow.authenticated.to(['write', 'read','delete']),
            allow.guest.to(['read'])
          ],
          'thumbs/*': [
            allow.resource(generateThumb).to(['write']),
            allow.resource(deleteThumb).to(['delete']),
            allow.authenticated.to(['read','delete']),
            allow.guest.to(['read'])
          ]
    }),
      
})