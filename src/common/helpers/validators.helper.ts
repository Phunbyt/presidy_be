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
        validate: (value: any): boolean => {
          // Check if value exists and is a string
          if (typeof value !== 'string') {
            return false;
          }

          // Split email into parts
          const parts = value.split('@');
          if (parts.length !== 2) {
            // Must have exactly one @ symbol
            return false;
          }

          const domainParts = parts[1].split('.');
          if (domainParts.length < 2) {
            // Must have at least one dot in domain
            return false;
          }

          const domainName = domainParts[0];
          return !unwanted.includes(domainName);
        },
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `This email domain is not allowed`,
      },
    });
  };
}