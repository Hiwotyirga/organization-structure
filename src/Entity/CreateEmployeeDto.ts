import { IsString, IsEmail, IsNumber } from 'class-validator';
import { Position } from 'src/Position.entity';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  positionId: number;
}
