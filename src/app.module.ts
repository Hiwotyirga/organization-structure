import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './Position.entity';
// import { Employee } from './Employee.entity';
// import { EmployeeController } from './EmployeeController';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'selam',
      database: 'hierarchy',
      entities: [Position],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Position]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
