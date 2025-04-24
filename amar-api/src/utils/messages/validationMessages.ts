import { isString, Matches } from 'class-validator';

const VALIDATION_MESSAGES = {
  EN: {
    child: {
      createChildDTO: {
        name: {
          isString: 'The name field needs to be of string type.',
          isNotEmpty: 'The name field is required.',
        },
        parentId: {
          isArray: 'The parentId field must be an array of strings.',
          isNotEmpty: 'The parentId field must not be empty.',
        },
      },
    },
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
    location: {
      createLocationDTO: {
        name: {
          isString: 'The name field needs to be of string type.',
          isNotEmpty: 'The name field is required.',
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
      },
      fetchLocationDTO: {
        name: {
          isString: 'The name field needs to be of string type.',
        },
        address: {
          isString: 'The address field needs to be of string type.',
        },
      },
      updateLocationDTO: {
        name: {
          isString: 'The name field needs to be of string type.',
        },
        address: {
          isString: 'The address field needs to be of string type.',
        },
        neighborhood: {
          isString: 'The neighborhood field needs to be of string type.',
        },
        city: {
          isString: 'The city field needs to be of string type.',
        },
      },
    },
    role: {
      createRoleDTO: {
        title: {
          isNotEmpty: 'The title field cannot be empty.',
          isString: 'The title field needs to be a string.',
        },
      },
    },
    user: {
      createUserDTO: {
        name: {
          isNotEmpty: 'The field name cannot be empty.',
          isString: 'The field name needs to be a string.',
        },
        email: {
          isNotEmpty: 'The field email cannot be empty.',
          isEmail:
            'The field email needs to be a valid email following the format: johndoe@mail.com',
        },
        password: {
          isNotEmpty: 'The field password cannot be empty.',
          isStrongPassword:
            'The field password needs to be a strong password that contains at least 8 characters, 1 symbol, 1 lowercase letter, 1 uppercase letter and 1 number. ',
        },
        pictureUrl: {
          isString: 'The field pictureUrl must be a string.',
        },
        roleId: {
          isUUID: 'The roleId must be in UUID format.',
        },
      },
      updateUserDTO: {
        name: {
          isNotEmpty: 'The field name cannot be empty.',
          isString: 'The field name needs to be a string.',
        },
        email: {
          isNotEmpty: 'The field email cannot be empty.',
          isEmail:
            'The field email needs to be a valid email following the format: johndoe@mail.com',
        },
        password: {
          isNotEmpty: 'The field password cannot be empty.',
          isStrongPassword:
            'The field password needs to be a strong password that contains at least 8 characters, 1 symbol, 1 lowercase letter, 1 uppercase letter and 1 number. ',
        },
        pictureUrl: {
          isString: 'The field pictureUrl must be a string.',
        },
        roleId: {
          isUUID: 'The roleId must be in UUID format.',
        },
      },
    },
  },
};

export default VALIDATION_MESSAGES;
