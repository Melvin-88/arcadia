const Joi = require('joi');

const JoiExtentions = [];

JoiExtentions.push(
  {
    base: Joi.any(),
    type: 'hosts',
    coerce: {
      from: 'string',
      method(value) {
        try {
          return { value: JSON.parse(value) };
        } catch (e) {
          return { value };
        }
      },
    },
    // eslint-disable-next-line consistent-return
    validate: (value, { error }) => {
      if (typeof value !== 'string' && !Array.isArray(value)) {
        return { value, errors: error('host.base') };
      }

      if (value === '') {
        return { value, errors: error('host.empty') };
      }
    },
    messages: {
      'host.base': '{{#label}} must be an array or string',
      'host.empty': '{{#label}} can not be empty',
    },
  },
  {
    base: Joi.any(),
    type: 'ports',
    coerce: {
      from: 'string',
      method(value) {
        try {
          const data = JSON.parse(value);
          return { value: Array.isArray(data) ? data.map(n => Number(n)) : Number(data) };
        } catch (e) {
          return { value };
        }
      },
    },
    // eslint-disable-next-line consistent-return
    validate: (value, { error }) => {
      if (!Number.isInteger(value) && !Array.isArray(value)) {
        return { value, errors: error('port.base') };
      }
      if (Array.isArray(value) && value.every(n => Number.isNaN(n))) {
        return { value, errors: error('port.every') };
      }
    },
    messages: {
      'port.base': '{{#label}} must be an array of numbers or number',
      'port.every': '{{#label}} each element must be a number',
      'port.empty': '{{#label}} can not be empty',
    },
  },
);

module.exports = JoiExtentions;
