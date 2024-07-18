import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Position } from './position.entity';
import { CreatePositionDto } from './Entity/create-position.dto';
import { UpdatePositionDto } from './Entity/update-position.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<InsertResult> {
    const position = this.positionRepository.create(createPositionDto);
    return this.positionRepository.insert(position);
  }

  async findAllPosition(): Promise<Position[]> {
    return this.positionRepository.find();
  }

  async findAll(): Promise<Position[]> {
    const allPositions = await this.positionRepository.find();

    const rootPositions = allPositions.filter(
      (position) => position.reportingToId === null,
    );
    return rootPositions.map((rootPosition) =>
      this.buildHierarchy(rootPosition, allPositions),
    );
  }

  private buildHierarchy(position: Position, allPositions: Position[]): any {
    const children = allPositions.filter(
      (child) => child.reportingToId === position.id,
    );

    return {
      id: position.id,
      name: position.name,
      description: position.description,
      reportingToId: position.reportingToId,
      children: children.map((child) =>
        this.buildHierarchy(child, allPositions),
      ),
    };
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
    updatePositionDto: Partial<UpdatePositionDto>,
  ): Promise<Position> {
    const position = await this.positionRepository.findOne({ where: { id } });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    await this.positionRepository.update(position.id, updatePositionDto);
    return position;
  }

  async removePosition(id: number): Promise<void> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['subordinates', 'reportingTo'],
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    for (const subordinate of position.subordinates) {
      await this.removePosition(subordinate.id);
    }

    const reportingToId = position.reportingToId;
    if (reportingToId) {
      await this.positionRepository.update(
        { reportingToId: id },
        { reportingToId },
      );
    }

    await this.positionRepository.remove(position);
  }

  async getChildren(id: number): Promise<Position[]> {
    const position = await this.positionRepository.findBy({
      reportingToId: id,
    });
    return position;
  }
}
