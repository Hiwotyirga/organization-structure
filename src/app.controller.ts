import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreatePositionDto } from './Entity/create-position.dto';
import { UpdatePositionDto } from './Entity/update-position.dto';
import { Position } from './Position.entity';

import { AppService } from './app.service';
import { InsertResult } from 'typeorm';

@Controller('positions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<InsertResult> {
    const createdPosition = await this.appService.create(createPositionDto);
    return createdPosition;
  }

  @Get()
  async findAll(): Promise<Position[]> {
    return this.appService.findAll();
  }
  @Get('all')
  async findAllPosion(): Promise<Position[]> {
    return this.appService.findAllPosition();
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
    const updatedPosition = await this.appService.update(id, updatePositionDto);
    return updatedPosition;
  }

  @Delete(':id')
  async removePosition(@Param('id') id: number): Promise<void> {
    await this.appService.removePosition(id);
  }

  @Get(':id/children')
  getChildren(@Param('id') id: number): Promise<Position[]> {
    return this.appService.getChildren(id);
  }
}
