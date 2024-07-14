import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  reportingToId: number;
}
