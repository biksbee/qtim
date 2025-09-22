import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

export const IS_SECURED_KEY = 'isSecured';

export const IsSecured = (value: boolean = true) => {
  if (value) {
    return applyDecorators(
      SetMetadata(IS_SECURED_KEY, value),
      ApiHeader({
        required: true,
        description: 'Auth token',
        name: 'auth-access-token',
        schema: {
          type: 'string',
        },
      }),
    );
  } else {
    return SetMetadata(IS_SECURED_KEY, value);
  }
}