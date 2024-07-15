import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './Position.entity';
import { CreatePositionDto } from './Entity/create-position.dto';
import { UpdatePositionDto } from './Entity/update-position.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    // @InjectRepository(Employee)
    // private employeeRepository: Repository<Employee>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const { reportingToId, ...otherData } = createPositionDto;
    const position = this.positionRepository.create(otherData);

    if (reportingToId) {
      const reportingTo = await this.positionRepository.findOne({
        where: { id: reportingToId },
      });

      if (!reportingTo) {
        throw new NotFoundException(
          `Position with ID ${reportingToId} not found`,
        );
      }

      position.reportingTo = reportingTo;
    }

    return this.positionRepository.save(position);
  }

  async findAll(): Promise<Position[]> {
    return this.positionRepository.find({
      relations: ['subordinates', 'reportingTo'],
    });
  }

  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['subordinates', 'reportingTo'],
    });
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return position;
  }

  async update(
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    const position = await this.findOne(id);
    position.name = updatePositionDto.name;
    position.description = updatePositionDto.description;
    position.reportingTo = updatePositionDto.reportingTo
      ? await this.findOne(updatePositionDto.reportingTo.id)
      : null;
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
  async getPositionHierarchy(rootPositionId: number): Promise<any> {
    const rootPosition = await this.positionRepository.findOne({
      where: { id: rootPositionId },
      relations: this.getNestedRelations(),
    });

    if (!rootPosition) {
      throw new NotFoundException(
        `Position with ID ${rootPositionId} not found`,
      );
    }

    return this.buildPositionHierarchy(rootPosition);
  }

  private getNestedRelations(): string[] {
    const relations = ['subordinates'];
    const maxDepth = 5;
    for (let i = 0; i < maxDepth; i++) {
      relations.push(...relations.map((rel) => `${rel}.subordinates`));
    }
    return relations;
  }

  private buildPositionHierarchy(position: Position): any {
    const positionData = {
      id: position.id,
      name: position.name,
      description: position.description,
      reportingToId: position.reportingToId,
      children: [],
    };

    if (position.subordinates && position.subordinates.length > 0) {
      for (const subordinate of position.subordinates) {
        positionData.children.push(this.buildPositionHierarchy(subordinate));
      }
    }

    return positionData;
  }
}
