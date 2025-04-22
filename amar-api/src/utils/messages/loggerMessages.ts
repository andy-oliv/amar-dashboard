const LOGGER_MESSAGES = {
  error: {
    client: {
      createClient: {
        conflict:
          'The new client cannot be registered because the same email was found in the database.',
        internalError:
          'An unexpected error ocurred during the creation of the new client in the database. Check the error log to find more information.',
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
  },
  log: {
    client: {
      createClient: {
        success: 'Client successfully created.',
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
  },
};

export default LOGGER_MESSAGES;
