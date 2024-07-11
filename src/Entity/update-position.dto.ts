import { IsString, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportingToDto {
  @IsNumber()
  id: number;
}

export class UpdatePositionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReportingToDto)
  reportingTo: ReportingToDto;
}
