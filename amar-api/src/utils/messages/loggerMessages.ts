const LOGGER_MESSAGES = {
  error: {
    helpers: {
      checkLocationById: {
        internalError:
          'An unexpected error occurred while checking the location ID. Please check the error log for more information.',
        notFound: 'The location was not found or the ID is invalid.',
      },
      findUser: {
        notFound:
          'The user was not found, the ID is incorrect or the user does not possess the required role for the task.',
      },
    },
    child: {
      createChild: {
        conflict:
          'The new child cannot be registered because the same name and parentId has been found in the database.',
        internalError:
          'An unexpected error ocurred during the registration of the new child in the database. Check the error log to find more information.',
      },
      deleteChild: {
        internalError:
          'An unexpected error ocurred while updating child in the database. Check the error log to find more information.',
        notFound: 'The child was found or the ID is incorrect.',
      },
      fetchChild: {
        internalError:
          'An unexpected error ocurred while fetching child in the database. Check the error log to find more information.',
        notFound: 'The child was not found or the ID is invalid.',
      },
      fetchChildren: {
        internalError:
          'An unexpected error ocurred while fetching the child registers in the database. Check the error log to find more information.',
      },
      fetchChildrenByName: {
        internalError:
          'An unexpected error ocurred while fetching child in the database. Check the error log to find more information.',
        notFound: 'No children were found.',
      },
      updateChild: {
        internalError:
          'An unexpected error ocurred while updating child in the database. Check the error log to find more information.',
        notFound: 'The child was found or the ID is incorrect.',
      },
    },
    client: {
      createClient: {
        conflict:
          'The new client cannot be registered because the same email was found in the database.',
        internalError:
          'An unexpected error ocurred during the registration of the new client in the database. Check the error log to find more information.',
      },
      deleteClient: {
        notFound: 'The ID is invalid or the client was not found.',
        internalError:
          'An error occurred while deleting the client. Check the error log to find more information.',
      },
      fetchClient: {
        internalError:
          'An error occurred while fetching the client. Check the error log to find more information.',
      },
      fetchClientsByName: {
        internalError:
          'An error occurred while fetching the client. Check the error log to find more information.',
      },
      fetchClients: {
        internalError:
          'An error occurred while fetching the clients. Check the error log to find more information.',
      },
      updateClient: {
        notFound: 'The ID is invalid or the client was not found.',
        internalError:
          'An error occurred while updating the client. Check the error log to find more information.',
      },
    },
    location: {
      createLocation: {
        conflict: 'This location has already been registered.',
        internalError:
          'An error occurred while creating the location. Check the error log to find more information.',
      },
      fetchLocation: {
        notFound: 'The location was not found or the ID is invalid.',
        internalError:
          'An error occurred while creating the location. Check the error log to find more information.',
      },
      fetchLocations: {
        internalError:
          'An error occurred while fetching the locations. Check the error log to find more information.',
      },
      fetchLocationsByNameOrAddress: {
        internalError:
          'An error occurred while fetching the locations. Check the error log to find more information.',
      },
      updateLocation: {
        notFound: 'The location was not found or the ID is invalid.',
        internalError:
          'An error occurred while updating the location. Check the error log to find more information.',
      },
      deleteLocation: {
        notFound: 'The location was not found or the ID is invalid.',
        internalError:
          'An error occurred while deleting the location. Check the error log to find more information.',
      },
    },
    role: {
      createRole: {
        conflict:
          'The new role cannot be registered because the same role title was found in the database.',
        internalError:
          'An unexpected error happened while creating the new role. Check the error log for more information.',
      },
      fetchRoles: {
        internalError:
          'An error occurred while fetching the roles. Check the error log to find more information.',
      },
      fetchRole: {
        internalError:
          'An error occurred while fetching the role. Check the error log to find more information.',
      },
      updateRole: {
        internalError:
          'An error occurred while updating the role. Check the error log to find more information.',
      },
      deleteRole: {
        internalError:
          'An error occurred while deleting the role. Check the error log to find more information.',
      },
    },
    user: {
      createUser: {
        conflict: 'The email that was sent already exists in the database.',
        internalError:
          'An error occurred while registering the user. Check the error log to find more information.',
        internalConnectionError:
          'An error occurred while connecting the user and the roles. Check the error log to find more information.',
      },
      deleteUser: {
        notFound:
          'The ID is not valid or there is no user with the provided ID.',
        internalError:
          'An error occurred while deleting the user. Check the error log to find more information.',
      },
      fetchUsers: {
        internalError:
          'An error occurred while fetching the users. Check the error log to find more information.',
      },
      fetchUser: {
        internalError:
          'An error occurred while fetching the user. Check the error log to find more information.',
      },
      updateUser: {
        internalError:
          'An error occurred while updating the user. Check the error log to find more information.',
        notFound: 'The user was not found or the ID is incorrect.',
      },
    },
    yogaClass: {
      createClass: {
        internalError:
          'An error occurred while creating the class. Check the error log to find more information.',
      },
      deleteClass: {
        internalError:
          'An error occurred while deleting the class. Check the error log to find more information.',
        notFound: 'The class was not found or the ID is invalid.',
      },
      fetchClasses: {
        internalError:
          'An error occurred while fetching the classes. Check the error log to find more information.',
      },
      fetchByQuery: {
        internalError:
          'An error occurred while fetching the classes. Check the error log to find more information.',
      },
      fetchByRange: {
        internalError:
          'An error occurred while fetching the classes. Check the error log to find more information.',
      },
      fetchClass: {
        internalError:
          'An error occurred while fetching the class. Check the error log to find more information.',
        notFound: 'The class was not found or the ID is invalid.',
      },
      updateClass: {
        internalError:
          'An error occurred while updating the class. Check the error log to find more information.',
        notFound: 'The class was not found or the ID is invalid.',
      },
    },
  },
  log: {
    child: {
      createChild: {
        success: 'Child successfully registered.',
      },
      fetchChildren: {
        notFound: 'There are no children to show.',
      },
    },
    client: {
      createClient: {
        success: 'Client successfully registered.',
      },
      deleteClient: {
        success: 'Client successfully deleted.',
      },
      fetchClients: {
        notFound: 'There are no registered clients in the database',
      },
      fetchClient: {
        notFound: 'No client was found with the given ID.',
      },
      fetchClientsByName: {
        notFound: 'No client was found with the given name.',
      },
      helpers: {
        badRequest:
          'One or more parent IDs are invalid or the parents are not registered yet. Check the log to see more information.',
      },
    },
    location: {
      createLocation: {
        success: 'Location successfully created.',
      },
      fetchLocations: {
        notFound: 'There are no locations to show.',
      },
      fetchLocationsByNameOrAddress: {
        notFound: 'No locations were found.',
      },
    },
    role: {
      createRole: {
        success: 'A role has successfully been created',
      },
      fetchRoles: {
        notFound: 'There are no roles to show.',
      },
      fetchRole: {
        notFound: 'No role was found with the given ID.',
      },
    },
    user: {
      createUser: {
        success: 'A new user has been registered.',
      },
      deleteUser: {
        success: 'A user has been deleted.',
      },
      fetchUsers: {
        notFound: 'There are no users to show.',
      },
      fetchUser: {
        notFound: 'The user was not found or the ID is incorrect',
      },
    },
    yogaClass: {
      createclass: {
        success: 'Class successfully created.',
      },
      fetchClasses: {
        notFound: 'There are no classes to show.',
      },
      fetchByQuery: {
        notFound: 'There are no classes to show.',
      },
      fetchByRange: {
        notFound: 'There are no classes to show.',
      },
    },
  },
};

export default LOGGER_MESSAGES;
