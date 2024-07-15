import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
// import { PositionService } from './position.service';
import { CreatePositionDto } from './Entity/create-position.dto';
import { UpdatePositionDto } from './Entity/update-position.dto';
import { Position } from './Position.entity';
// import { PositionService } from './positionService';
// import { appService } from './app.service';
import { AppService } from './app.service';
import { Employee } from './Employee.entity';

@Controller('positions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    const createposition = await this.appService.create(createPositionDto);

    return createposition;
  }

  @Get()
  async findAll(): Promise<Position[]> {
    return this.appService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Position> {
    const findone = await this.appService.findOne(id);
    return findone;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    const patch = await this.appService.update(id, updatePositionDto);
    return patch;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const removePosition = await this.appService.remove(id);
    return removePosition;
  }
  @Get('hierarchy/:id')
  async getPositionHierarchy(@Param('id') id: number): Promise<any> {
    const positionHierarchy = await this.appService.getPositionHierarchy(id);
    return positionHierarchy;
  }

  @Get(':id/children')
  getChildren(@Param('id') id: number): Promise<Position[]> {
    return this.appService.getChildren(id);
  }
}
