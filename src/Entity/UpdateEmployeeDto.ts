import { IsString, IsEmail, IsOptional } from 'class-validator';
import { Position } from 'src/Position.entity';

export class UpdateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  position: Position;
}
