const HTTP_MESSAGES = {
  EN: {
    generalMessages: {
      status_500:
        'An unexpected error occurred. Please check the error log for more information.',
    },
    helpers: {
      checkLocationById: {
        status_404: 'The location was not found.',
      },
      findUser: {
        status_404:
          'The user was not found or the user does not have permission for this task',
      },
    },
    child: {
      createChild: {
        status_201: 'Child successfully registered.',
        status_409: 'This child has already been registered.',
      },
      deleteChild: {
        status_200: 'Child successfully deleted.',
        status_404: 'The child was not found.',
      },
      fetchChild: {
        status_200: 'Child successfully found',
        status_404: 'The child was not found.',
      },
      fetchChildren: {
        status_200: 'Children successfully fetched.',
        status_404: 'There are no registers to show.',
      },
      fetchChildrenByName: {
        status_200: 'Children successfully fetched.',
        status_404: 'There are no registers to show.',
      },
      updateChild: {
        status_200: 'Child successfully updated.',
        status_404: 'The child was not found.',
      },
    },
    client: {
      createClient: {
        status_201: 'Client successfully regisred.',
        status_409: 'This client has already been registered.',
      },
      deleteClient: {
        status_200: 'Client successfully deleted.',
        status_404: 'Client not found.',
      },
      fetchClients: {
        status_200: 'Clients successfully returned.',
        status_404: 'There are no clients to show.',
      },
      fetchClient: {
        status_200: 'Client successfully found.',
        status_404: 'Client not found.',
      },
      fetchClientsByName: {
        status_200: 'Clients successfully found.',
        status_404: 'No clients found.',
      },
      helpers: {
        status_400: 'One or more parent IDs are invalid.',
      },
      updateClient: {
        status_200: 'Client successfully updated.',
        status_404: 'client not found.',
      },
    },
    location: {
      createLocation: {
        status_201: 'Location successfully created.',
        status_409: 'This location has already been registered.',
      },
      fetchLocation: {
        status_200: 'Location successfully found.',
        status_404: 'The location was not found.',
      },
      fetchLocations: {
        status_200: 'Locations successfully found.',
        status_404: 'There are no locations to show.',
      },
      fetchLocationsByNameOrAddress: {
        status_200: 'Locations successfully found.',
        status_400: 'At least a name or address must be provided.',
        status_404: 'There are no locations to show.',
      },
      updateLocation: {
        status_200: 'Location successfully updated.',
        status_404: 'The location was not found.',
      },
      deleteLocation: {
        status_200: 'Location successfully deleted.',
        status_404: 'The location was not found.',
      },
    },
    role: {
      createRole: {
        status_201: 'The role has successfully been created.',
        status_409: 'This role has already been registered.',
      },
      fetchRoles: {
        status_200: 'The roles have been successfully found.',
        status_404: 'No roles were found.',
      },
      fetchRole: {
        status_200: 'Role successfully found.',
        status_404: 'No role was found with the given ID.',
      },
      updateRole: {
        status_200: 'Role sucessfully updated.',
      },

      deleteRole: {
        status_200: 'Role successfully deleted.',
      },
    },
    user: {
      createUser: {
        status_201: 'User successfully registered.',
        status_409: 'This user has already been registered.',
      },
      fetchUsers: {
        status_200: 'User list successfully found.',
        status_404: 'No users were found.',
      },
      fetchUser: {
        status_200: 'User successfully found.',
        status_404: 'User not found.',
      },
      updateUser: {
        status_200: 'User successfully updated.',
        status_404: 'User not found.',
      },
      deleteUser: {
        status_200: 'User successfully deleted.',
        status_404: 'The user was not found.',
      },
    },
    yogaClass: {
      createClass: {
        status_201: 'Class successfully created.',
        status_400:
          'Invalid date: yoga classes cannot be scheduled for past dates.',
        status_409: 'The class already exists.',
      },
      deleteClass: {
        status_200: 'Class successfully deleted.',
        status_404: 'Class not found.',
      },
      fetchClass: {
        status_200: 'Class successfully fetched.',
        status_404: 'The class was not found.',
      },
      fetchClasses: {
        status_200: 'Classes successfully fetched.',
        status_404: 'There are no classes to show.',
      },
      fetchByQuery: {
        status_200: 'Classes successfully fetched.',
        status_404: 'There are no classes to show.',
      },
      fetchByRange: {
        status_200: 'Classes successfully fetched.',
        status_404: 'There are no classes to show.',
      },
      updateClass: {
        status_200: 'Class successfully updated.',
        status_404: 'Class not found.',
        status_400:
          'Invalid date: yoga classes cannot be scheduled for past dates.',
      },
    },
  },
};

export default HTTP_MESSAGES;
