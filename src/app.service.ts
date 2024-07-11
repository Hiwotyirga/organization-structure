import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './Position.entity';
import { CreatePositionDto } from './Entity/create-position.dto';
import { UpdatePositionDto } from './Entity/update-position.dto';
import { Employee } from './Employee.entity';
import { CreateEmployeeDto } from './Entity/CreateEmployeeDto';
import { UpdateEmployeeDto } from './Entity/UpdateEmployeeDto';

@Injectable()
export class AppService  {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const { reportingToId, ...otherData } = createPositionDto;
    const position = this.positionRepository.create(otherData);

    if (reportingToId) {
      const reportingTo = await this.findOne(reportingToId);
      position.reportingTo = reportingTo;
    }

    return this.positionRepository.save(position);
  }
  async findAll(): Promise<Position[]> {
    return this.positionRepository.find({ relations: ['subordinates', 'reportingTo'] });
  }


  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepository.findOne({ where: { id }, relations: ['subordinates', 'reportingTo'] });
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return position;
  }

  async update(id: number, updatePositionDto: UpdatePositionDto): Promise<Position> {
    const position = await this.findOne(id);
    position.name = updatePositionDto.name;
    position.description = updatePositionDto.description;
    position.reportingTo = updatePositionDto.reportingTo ? await this.findOne(updatePositionDto.reportingTo.id) : null;
    return this.positionRepository.save(position);
  }
  
  async remove(id: number): Promise<void> {
    const position = await this.findOne(id);
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    await this.positionRepository.remove(position);
  }
  async getChildren(id: number): Promise<Position[]> {
    const position = await this.findOne(id);
    return position.subordinates;
  }
  async getHierarchy(): Promise<Position[]> {
    const ceo = await this.positionRepository.findOne({
      where: { id: 1 },
      relations: ['subordinates', 'reportingTo'],
    });
    if (!ceo) {
      throw new NotFoundException(`CEO position not found`);
    }
    return [this.buildHierarchy(ceo)];
  }

  private buildHierarchy(position: Position): Position {
    const hierarchy = { ...position, subordinates: [] };
    if (position.subordinates && position.subordinates.length > 0) {
      hierarchy.subordinates = position.subordinates.map(subordinate => this.buildHierarchy(subordinate));
    }
    return hierarchy;
  }
 
  
}


