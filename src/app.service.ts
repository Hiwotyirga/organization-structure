import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';
import { CreatePositionDto } from './Entity/create-position.dto';
import { UpdatePositionDto } from './Entity/update-position.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
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
  // async getHierarchy(): Promise<Position[]> {
  //   const allPositions = await this.positionRepository.find({
  //     relations: ['subordinates', 'reportingTo'],
  //   });
  //   return allPositions;
  // }

  //  async findAllPosition(): Promise<Position[]> {
  //   return  this.positionRepository.find({
  //     relations: ['subordinates', 'reportingTo'],
  //   })

  async findAllPosition(): Promise<Position[]> {
    return this.positionRepository.find({
      relations: ['subordinates', 'reportingTo'],
    });
  }

  async findAll(): Promise<Position[]> {
    const allPositions = await this.positionRepository.find({
      relations: ['subordinates', 'reportingTo'],
    });

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

  // AppService update method
  async update(id: number, updatePositionDto: UpdatePositionDto): Promise<Position> {
    const position = await this.positionRepository.findOne({where:{id}});
  
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
  
    position.name = updatePositionDto.name;
    position.description = updatePositionDto.description;
  
    if (updatePositionDto.reportingToId) {
      position.reportingToId = updatePositionDto.reportingToId;
    } else {
      position.reportingToId = null; // Clear reportingToId if not provided in updatePositionDto
    }
  
    return this.positionRepository.save(position);
  }


  // async remove(id: number): Promise<void> {
  //   const position = await this.findOne(id);
  //   if (!position) {
  //     throw new NotFoundException(`Position with ID ${id} not found`);
  //   }
  //   await this.positionRepository.remove(position);
  // }
  async removePosition(id: number): Promise<void> {
    const position = await this.positionRepository.findOne({where:{id}});
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    
    // Remove position from its parent's subordinates
    const parent = position.reportingTo;
    if (parent) {
      parent.subordinates = parent.subordinates.filter(sub => sub.id !== id);
      await this.positionRepository.save(parent);
    }

    await this.positionRepository.remove(position);
  }

  async getChildren(id: number): Promise<Position[]> {
    const position = await this.findOne(id);
    return position.subordinates;
  }

  //   async getCompleteHierarchy(): Promise<Position[]> {
  //     const allPositions = await this.positionRepository.find({
  //       relations: ['subordinates', 'reportingTo'],
  //     });

  //     return allPositions;
  // }
}
