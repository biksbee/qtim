import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const IS_SECURED_KEY = 'isSecured';

export const IsSecured = (value: boolean = true) => {
  if (value) {
    return applyDecorators(
      SetMetadata(IS_SECURED_KEY, value),
      ApiBearerAuth()
    );
  } else {
    return SetMetadata(IS_SECURED_KEY, value);
  }
}