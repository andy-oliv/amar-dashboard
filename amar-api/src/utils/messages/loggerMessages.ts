const LOGGER_MESSAGES = {
  error: {
    client: {
      createClient: {
        conflict:
          'The new client cannot be registered because the same email was found in the database.',
        internalError:
          'An unexpected error ocurred during the creation of the new client in the database. Check the error log to find more information.',
      },
      fetchClients: {
        internalError:
          'An error occurred while fetching the clients. Check the error log to find more information.',
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
      updateRole: {
        internalError:
          'An error occurred while updating the role. Check the error log to find more information.',
      },
      deleteRole: {
        internalError:
          'An error occurred while deleting the role. Check the error log to find more information.',
      },
    },
  },
  log: {
    client: {
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
  },
};

export default LOGGER_MESSAGES;
