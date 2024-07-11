// create-position.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';
// import { Position } from '../entities/Position.entity';
import { Position } from 'src/Position.entity';

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  reportingToId: number;
}
