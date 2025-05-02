import { isNotEmpty, isString, Matches } from 'class-validator';
import UpdateClassDTO from '../../yogaclass/dto/updateClassDTO';

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
    rollCall: {
      createRollCallDTO: {
        classId: {
          isNotEmpty: 'The classId field cannot be empty.',
          isInt: 'The classId field needs to be a number.',
        },
        date: {
          isNotEmpty: 'The date field cannot be empty.',
          isDate: 'The date field must be filled with a valid date.',
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
    yogaClass: {
      createYogaClassDTO: {
        type: {
          IsIn: 'Please check the type value. It is not valid',
          isNotEmpty: 'The type field must not be blank.',
        },
        status: {
          IsIn: 'Please check the status value. It is not valid',
          isNotEmpty: 'The status field must not be blank.',
        },
        locationId: {
          isNumber: 'the locationId must be a number',
          isNotEmpty: 'The locationId field must not be blank.',
        },
        date: {
          isDateString: 'The date field must be a valid date string.',
          isNotEmpty: 'The date field must not be blank.',
        },
        time: {
          isNotEmpty: 'The time field cannot be blank.',
          matches:
            'Invalid time. The string needs to follow the format HH:mm:ss in 24 hours',
        },
        InstructorId: {
          isUUID: 'The instructor ID must be a UUID.',
          isNotEmpty: 'The instructorId field must not be blank.',
        },
      },
      fetchClassesDTO: {
        type: {
          IsIn: 'Please check the type value. It is not valid',
        },
        status: {
          IsIn: 'Please check the status value. It is not valid',
        },
        locationId: {
          isNumber: 'the locationId must be a number',
        },
        date: {
          isDateString: 'The date field must be a valid date string.',
        },
        InstructorId: {
          isUUID: 'The instructor ID must be a UUID.',
        },
      },
      fetchByRangeDTO: {
        rangeStart: {
          isNotEmpty: 'The rangeStart field must not be empty.',
          isDateString: 'The rangeStart field must be a valid date string.',
        },
        rangeEnd: {
          isNotEmpty: 'The rangeEnd field must not be empty.',
          isDateString: 'The rangeEnd field must be a valid date string.',
        },
      },
      updateClassDTO: {
        type: {
          IsIn: 'Please check the type value. It is not valid',
        },
        status: {
          IsIn: 'Please check the status value. It is not valid',
        },
        locationId: {
          isNumber: 'the locationId must be a number',
        },
        date: {
          isDateString: 'The date field must be a valid date string.',
        },
        time: {
          matches:
            'Invalid time. The string needs to follow the format HH:mm:ss in 24 hours',
        },
        InstructorId: {
          isUUID: 'The instructor ID must be a UUID.',
        },
      },
    },
  },
};

export default VALIDATION_MESSAGES;
