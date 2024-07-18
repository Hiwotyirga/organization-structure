import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdatePositionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  reportingToId: number;
}
