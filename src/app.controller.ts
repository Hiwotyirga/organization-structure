import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
// import { PositionService } from './position.service';
import { CreatePositionDto } from './Entity/create-position.dto';
import { UpdatePositionDto } from './Entity/update-position.dto';
import { Position } from './Position.entity';
// import { PositionService } from './positionService';
// import { appService } from './app.service';
import { AppService } from './app.service';
import { Employee } from './Employee.entity';
import { CreateEmployeeDto } from './Entity/CreateEmployeeDto';
import { UpdateEmployeeDto } from './Entity/UpdateEmployeeDto';

@Controller('positions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.appService.create(createPositionDto);
  }

  @Get()
  findAll(): Promise<Position[]> {
    return this.appService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Position> {
    return this.appService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePositionDto: UpdatePositionDto): Promise<Position> {
    return this.appService.update(id, updatePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.appService.remove(id);
  }

  @Get(':id/children')
  getChildren(@Param('id') id: number): Promise<Position[]> {
    return this.appService.getChildren(id);
  }
  @Get('hierarchy')
  async getHierarchy(): Promise<Position[]> {
    return this.appService.getHierarchy();
  }
  
}