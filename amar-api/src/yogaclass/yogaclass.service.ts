import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import YogaClass from '../interfaces/YogaClass';
import EndpointReturn from '../interfaces/EndpointReturn';
import { checkLocationById } from '../helpers/location.helper';
import { findUser } from '../helpers/user.helper';
import { User } from '../interfaces/User';
import generateTimestamp from '../helpers/generateTimestamp';
import LOGGER_MESSAGES from '../utils/messages/loggerMessages';
import HTTP_MESSAGES from '../utils/messages/httpMessages';
import * as dayjs from 'dayjs';
import FetchClassesDTO from './dto/fetchClassesDTO';
import FetchByRangeDTO from './dto/fetchByRangeDTO';
import { parseIsoString } from '../helpers/time.helper';
import CreateClassDTO from './dto/createClassDTO';
import UpdateClassDTO from './dto/updateClassDTO';
import {
  checkClassExists,
  checkinstructorRoles,
  checkStudentExists,
} from '../helpers/yogaClass.helper';

@Injectable()
export class YogaclassService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createClass(classinfo: CreateClassDTO): Promise<EndpointReturn> {
    await checkinstructorRoles(this.prismaService, classinfo.instructorId);

    await checkLocationById(
      this.prismaService,
      this.logger,
      classinfo.locationId,
    );

    if (dayjs(classinfo.date).isBefore(dayjs())) {
      throw new BadRequestException({
        message: HTTP_MESSAGES.EN.yogaClass.createClass.status_400,
        pid: process.pid,
        timestamp: generateTimestamp(),
      });
    }

    try {
      const newClass: YogaClass = await this.prismaService.yogaClass.create({
        data: {
          type: classinfo.type,
          status: classinfo.status,
          date: parseIsoString(classinfo.date, classinfo.time),
          instructorId: classinfo.instructorId,
          locationId: classinfo.locationId,
        },
      });

      return {
        message: HTTP_MESSAGES.EN.yogaClass.createClass.status_201,
        data: newClass,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.createClass.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async fetchClasses(): Promise<EndpointReturn> {
    try {
      const classes: YogaClass[] =
        await this.prismaService.yogaClass.findMany();

      if (classes.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.yogaClass.fetchClasses.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.yogaClass.fetchClasses.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.yogaClass.fetchClasses.status_200,
        data: classes,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.fetchClasses.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async fetchByQuery(query: FetchClassesDTO): Promise<EndpointReturn> {
    try {
      let parsedDate: string;
      if (query.date) {
        parsedDate = parseIsoString(query.date);
      }

      const classes: YogaClass[] = await this.prismaService.yogaClass.findMany({
        where: {
          OR: [
            { type: query.type },
            { status: query.status },
            {
              date: {
                gte: dayjs(parsedDate).startOf('day').toDate(),
                lte: dayjs(parsedDate).endOf('day').toDate(),
              },
            },
            { instructorId: query.instructorId },
            { locationId: query.locationId },
          ],
        },
      });

      if (classes.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.yogaClass.fetchByQuery.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.yogaClass.fetchByQuery.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.yogaClass.fetchByQuery.status_200,
        data: classes,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.fetchByQuery.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async fetchByRange({
    rangeStart,
    rangeEnd,
  }: FetchByRangeDTO): Promise<EndpointReturn> {
    const parsedStart: string = parseIsoString(rangeStart, '00:00:00');
    const parsedEnd: string = parseIsoString(rangeEnd, '23:59:59');
    try {
      const classes: YogaClass[] = await this.prismaService.yogaClass.findMany({
        where: {
          date: {
            gte: parsedStart,
            lte: parsedEnd,
          },
        },
      });

      if (classes.length === 0) {
        const timestamp: string = generateTimestamp();

        this.logger.log({
          message: LOGGER_MESSAGES.log.yogaClass.fetchByRange.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.yogaClass.fetchByRange.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      return {
        message: HTTP_MESSAGES.EN.yogaClass.fetchByRange.status_200,
        data: classes,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.fetchByRange.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async fetchClass(id: number): Promise<EndpointReturn> {
    try {
      const newClass: YogaClass =
        await this.prismaService.yogaClass.findUniqueOrThrow({
          where: {
            id,
          },
          include: {
            adultStudents: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            childStudents: {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    parents: {
                      include: {
                        client: {
                          select: {
                            id: true,
                            name: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
                pictureUrl: true,
              },
            },
            location: {
              select: {
                id: true,
                name: true,
                address: true,
                neighborhood: true,
                city: true,
              },
            },
            rollCall: true,
            transactions: true,
          },
        });

      return {
        message: HTTP_MESSAGES.EN.yogaClass.fetchClass.status_200,
        data: newClass,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      if (error.code === 'P2025') {
        this.logger.error({
          message: LOGGER_MESSAGES.error.yogaClass.fetchClass.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.yogaClass.fetchClass.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.fetchClass.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async updateClass(
    id: number,
    classData: UpdateClassDTO,
  ): Promise<EndpointReturn> {
    const foundClass: YogaClass = await this.prismaService.yogaClass.findFirst({
      where: {
        id: id,
      },
    });

    if (!foundClass) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.updateClass.notFound,
        pid: process.pid,
        timestamp,
      });

      throw new NotFoundException({
        message: HTTP_MESSAGES.EN.yogaClass.updateClass.status_404,
        pid: process.pid,
        timestamp,
      });
    }

    if (classData.instructorId) {
      const instructor: User = await findUser(
        this.prismaService,
        classData.instructorId,
      );

      let instructorRoles: string[] = instructor.roles.map(
        (role) => role.roleId,
      );

      if (
        instructorRoles.length === 0 ||
        !instructorRoles.includes(process.env.YOGA_INSTRUCTOR_ROLE_ID)
      ) {
        const timestamp: string = generateTimestamp();

        this.logger.error({
          message: LOGGER_MESSAGES.error.helpers.findUser.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.helpers.findUser.status_404,
          pid: process.pid,
          timestamp,
        });
      }
    }

    if (classData.locationId) {
      await checkLocationById(
        this.prismaService,
        this.logger,
        classData.locationId,
      );
    }

    if (classData.date) {
      if (dayjs(classData.date).isBefore(dayjs())) {
        throw new BadRequestException({
          message: HTTP_MESSAGES.EN.yogaClass.updateClass.status_400,
          pid: process.pid,
          timestamp: generateTimestamp(),
        });
      }
    }

    try {
      const updatedClass: YogaClass = await this.prismaService.yogaClass.update(
        {
          where: {
            id: id,
          },
          data: {
            type: classData.type,
            status: classData.status,
            date: parseIsoString(
              classData.date ? classData.date : foundClass.date,
              classData.time
                ? classData.time
                : dayjs(foundClass.date).format('HH:mm:ss'),
            ),
            instructorId: classData.instructorId,
            locationId: classData.locationId,
          },
        },
      );

      return {
        message: HTTP_MESSAGES.EN.yogaClass.updateClass.status_200,
        data: updatedClass,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.updateClass.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });
      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async deleteClass(classId: number): Promise<EndpointReturn> {
    try {
      const deletedClass: YogaClass = await this.prismaService.yogaClass.delete(
        {
          where: {
            id: classId,
          },
        },
      );

      return {
        message: HTTP_MESSAGES.EN.yogaClass.deleteClass.status_200,
        data: deletedClass,
      };
    } catch (error) {
      const timestamp: string = generateTimestamp();

      if (error.code === 'P2025') {
        this.logger.error({
          message: LOGGER_MESSAGES.error.yogaClass.deleteClass.notFound,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.yogaClass.deleteClass.status_404,
          pid: process.pid,
          timestamp,
        });
      }

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.deleteClass.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async addStudent(
    classId: number,
    studentId: string,
  ): Promise<{ message: string }> {
    const foundClass: YogaClass = await checkClassExists(
      this.prismaService,
      classId,
    );

    await checkStudentExists(this.prismaService, foundClass.type, studentId);

    try {
      if (foundClass.type === 'ADULTS') {
        await this.prismaService.yogaAdultStudent.create({
          data: {
            studentId,
            yogaClassId: classId,
          },
        });
      } else {
        await this.prismaService.yogaChildStudent.create({
          data: {
            studentId,
            yogaClassId: classId,
          },
        });
      }

      return {
        message: HTTP_MESSAGES.EN.yogaClass.addStudent.status_200,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.code === 'P2002') {
        const timestamp: string = generateTimestamp();

        this.logger.error({
          message: LOGGER_MESSAGES.error.yogaClass.addStudent.conflict,
          pid: process.pid,
          timestamp,
        });

        throw new ConflictException({
          message: HTTP_MESSAGES.EN.yogaClass.addStudent.status_409,
          pid: process.pid,
          timestamp,
        });
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.addStudent.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }

  async removeStudent(
    classId: number,
    studentId: string,
  ): Promise<{ message: string }> {
    const foundClass: YogaClass = await checkClassExists(
      this.prismaService,
      classId,
    );

    await checkStudentExists(this.prismaService, foundClass.type, studentId);

    try {
      if (foundClass.type === 'ADULTS') {
        await this.prismaService.yogaAdultStudent.delete({
          where: {
            yogaClassId_studentId: {
              studentId,
              yogaClassId: classId,
            },
          },
        });
      } else {
        await this.prismaService.yogaChildStudent.delete({
          where: {
            yogaClassId_studentId: {
              studentId,
              yogaClassId: classId,
            },
          },
        });
      }

      return {
        message: HTTP_MESSAGES.EN.yogaClass.deleteStudent.status_200,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.code === 'P2025') {
        const timestamp: string = generateTimestamp();

        this.logger.error({
          message: LOGGER_MESSAGES.error.yogaClass.deleteStudent.notFound,
          code: error.code,
          error: error.message,
          stack: error.stack,
          pid: process.pid,
          timestamp,
        });

        throw new NotFoundException({
          message: HTTP_MESSAGES.EN.yogaClass.deleteStudent.status_404_P2025,
          pid: process.pid,
          timestamp,
        });
      }

      const timestamp: string = generateTimestamp();

      this.logger.error({
        message: LOGGER_MESSAGES.error.yogaClass.deleteStudent.internalError,
        code: error.code,
        error: error.message,
        stack: error.stack,
        pid: process.pid,
        timestamp,
      });

      throw new InternalServerErrorException({
        message: HTTP_MESSAGES.EN.generalMessages.status_500,
        pid: process.pid,
        timestamp,
      });
    }
  }
}
