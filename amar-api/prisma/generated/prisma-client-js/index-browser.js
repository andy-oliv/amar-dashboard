
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  pictureUrl: 'pictureUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  userId: 'userId',
  roleId: 'roleId'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  address: 'address',
  neighborhood: 'neighborhood',
  city: 'city',
  cpf: 'cpf',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChildScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FamilyScalarFieldEnum = {
  clientId: 'clientId',
  childId: 'childId'
};

exports.Prisma.YogaClassScalarFieldEnum = {
  id: 'id',
  type: 'type',
  status: 'status',
  locationId: 'locationId',
  date: 'date',
  instructorId: 'instructorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  neighborhood: 'neighborhood',
  city: 'city',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.YogaChildStudentScalarFieldEnum = {
  yogaClassId: 'yogaClassId',
  studentId: 'studentId'
};

exports.Prisma.YogaAdultStudentScalarFieldEnum = {
  yogaClassId: 'yogaClassId',
  studentId: 'studentId'
};

exports.Prisma.RollCallScalarFieldEnum = {
  id: 'id',
  classId: 'classId',
  date: 'date',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PresenceScalarFieldEnum = {
  id: 'id',
  studentType: 'studentType',
  rollCallId: 'rollCallId',
  adultStudentId: 'adultStudentId',
  childStudentId: 'childStudentId',
  isPresent: 'isPresent',
  absenceReason: 'absenceReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContractScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  address: 'address',
  neighborhood: 'neighborhood',
  city: 'city',
  date: 'date',
  eventStartTime: 'eventStartTime',
  commutingFee: 'commutingFee',
  discountPercentage: 'discountPercentage',
  paymentDueDate: 'paymentDueDate',
  observations: 'observations',
  fileUrl: 'fileUrl',
  videomakerId: 'videomakerId',
  packageId: 'packageId',
  isSigned: 'isSigned',
  isPaid: 'isPaid',
  generalStatus: 'generalStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  date: 'date',
  description: 'description',
  method: 'method',
  isPaid: 'isPaid',
  contractId: 'contractId',
  yogaClassId: 'yogaClassId',
  clientId: 'clientId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContractPhotographerScalarFieldEnum = {
  photographerId: 'photographerId',
  contractId: 'contractId'
};

exports.Prisma.ClientContractScalarFieldEnum = {
  clientId: 'clientId',
  contractId: 'contractId',
  assignedAt: 'assignedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  message: 'message',
  isRead: 'isRead',
  type: 'type',
  clientId: 'clientId',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PackageScalarFieldEnum = {
  id: 'id',
  name: 'name',
  pixPrice: 'pixPrice',
  cardPrice: 'cardPrice',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  pictureUrl: 'pictureUrl'
};

exports.Prisma.RoleOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title'
};

exports.Prisma.UserRoleOrderByRelevanceFieldEnum = {
  userId: 'userId',
  roleId: 'roleId'
};

exports.Prisma.ClientOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  address: 'address',
  neighborhood: 'neighborhood',
  city: 'city',
  cpf: 'cpf'
};

exports.Prisma.ChildOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.FamilyOrderByRelevanceFieldEnum = {
  clientId: 'clientId',
  childId: 'childId'
};

exports.Prisma.YogaClassOrderByRelevanceFieldEnum = {
  instructorId: 'instructorId'
};

exports.Prisma.LocationOrderByRelevanceFieldEnum = {
  name: 'name',
  address: 'address',
  neighborhood: 'neighborhood',
  city: 'city'
};

exports.Prisma.YogaChildStudentOrderByRelevanceFieldEnum = {
  studentId: 'studentId'
};

exports.Prisma.YogaAdultStudentOrderByRelevanceFieldEnum = {
  studentId: 'studentId'
};

exports.Prisma.PresenceOrderByRelevanceFieldEnum = {
  adultStudentId: 'adultStudentId',
  childStudentId: 'childStudentId',
  absenceReason: 'absenceReason'
};

exports.Prisma.ContractOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  neighborhood: 'neighborhood',
  city: 'city',
  observations: 'observations',
  fileUrl: 'fileUrl',
  videomakerId: 'videomakerId'
};

exports.Prisma.TransactionOrderByRelevanceFieldEnum = {
  id: 'id',
  description: 'description',
  contractId: 'contractId',
  clientId: 'clientId'
};

exports.Prisma.ContractPhotographerOrderByRelevanceFieldEnum = {
  photographerId: 'photographerId',
  contractId: 'contractId'
};

exports.Prisma.ClientContractOrderByRelevanceFieldEnum = {
  clientId: 'clientId',
  contractId: 'contractId'
};

exports.Prisma.NotificationOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  message: 'message',
  clientId: 'clientId',
  userId: 'userId'
};

exports.Prisma.PackageOrderByRelevanceFieldEnum = {
  name: 'name'
};
exports.YogaClassType = exports.$Enums.YogaClassType = {
  ADULTS: 'ADULTS',
  CHILDREN: 'CHILDREN'
};

exports.YogaClassStatus = exports.$Enums.YogaClassStatus = {
  SCHEDULED: 'SCHEDULED',
  CANCELLED: 'CANCELLED',
  DONE: 'DONE',
  RESCHEDULED: 'RESCHEDULED'
};

exports.StudentType = exports.$Enums.StudentType = {
  ADULT: 'ADULT',
  CHILD: 'CHILD'
};

exports.ContractType = exports.$Enums.ContractType = {
  PHOTOSHOOT: 'PHOTOSHOOT',
  EVENT: 'EVENT'
};

exports.SignatureStatus = exports.$Enums.SignatureStatus = {
  SIGNED: 'SIGNED',
  PENDING: 'PENDING'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING'
};

exports.GeneralStatus = exports.$Enums.GeneralStatus = {
  SCHEDULED: 'SCHEDULED',
  EDITING: 'EDITING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  PIX: 'PIX',
  CREDIT_CARD: 'CREDIT_CARD'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  CONTRACT_CREATED: 'CONTRACT_CREATED',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  EVENT_FINISHED: 'EVENT_FINISHED',
  CLASS_FINISHED: 'CLASS_FINISHED',
  EVENT_TIME: 'EVENT_TIME',
  CLASS_TIME: 'CLASS_TIME',
  CUSTOM: 'CUSTOM'
};

exports.Prisma.ModelName = {
  User: 'User',
  Role: 'Role',
  UserRole: 'UserRole',
  Client: 'Client',
  Child: 'Child',
  Family: 'Family',
  YogaClass: 'YogaClass',
  Location: 'Location',
  YogaChildStudent: 'YogaChildStudent',
  YogaAdultStudent: 'YogaAdultStudent',
  RollCall: 'RollCall',
  Presence: 'Presence',
  Contract: 'Contract',
  Transaction: 'Transaction',
  ContractPhotographer: 'ContractPhotographer',
  ClientContract: 'ClientContract',
  Notification: 'Notification',
  Package: 'Package'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
