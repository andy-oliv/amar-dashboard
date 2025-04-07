import { Matches } from 'class-validator';

const VALIDATION_MESSAGES = {
  EN: {
    client: {
      createClientDTO: {
        name: {
          isString: 'The name field needs to be of string type.',
          isNotEmpty: 'The name field is required.',
        },
        email: {
          isEmail: 'The email field needs to be a valid email.',
        },
        address: {
          isString: 'The address field needs to be of string type.',
          isNotEmpty: 'The address field is required.',
        },
        neighborhood: {
          isString: 'The neighborhood field needs to be of string type.',
          isNotEmpty: 'The neighborhood field is required.',
        },
        city: {
          isString: 'The city field needs to be of string type.',
          isNotEmpty: 'The city field is required.',
        },
        cpf: {
          isValidFormat: 'The CPF must be 11 numeric digits.',
          isString: 'The cpf field needs to be of string type.',
          isNotEmpty: 'The cpf field is required.',
        },
      },
    },
  },
};

export default VALIDATION_MESSAGES;
