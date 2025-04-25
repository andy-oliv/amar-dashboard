import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export default class AddStudentDTO {
  @IsNotEmpty({ message: "studentId can't be blank" })
  @IsUUID(4, { message: 'not a valid UUID' })
  studentId: string;

  @IsNotEmpty({ message: "classId can't be blank" })
  @IsNumber({ allowNaN: false }, { message: 'not a number' })
  classId: number;
}
