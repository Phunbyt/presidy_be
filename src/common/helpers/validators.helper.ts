/* eslint-disable */ // conflict with prettier and eslint
import { BadRequestException } from '@nestjs/common';

import {
  isNotEmpty,
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { unwanted } from 'src/modules/auth/dto/unwanted-email-domains';

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isNotEmptyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments.property} should not be an empty string`,
      },
    });
  };
}

export function IsNotFraudEmail(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isNotFraudEmail',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          !unwanted.includes(value.split('@')[1].split('.')[0]),
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `this email domain is not allowed`,
      },
    });
  };
}
