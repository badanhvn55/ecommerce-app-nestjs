import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../config/entities/todo.entity';
import { DatabaseTodoRepository } from './todo.repository';
import { User } from '../config/entities/user.entity';
import { DatabaseUserRepository } from './user.repository';

@Module({
    imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Todo, User])],
    providers: [DatabaseTodoRepository, DatabaseUserRepository],
    exports: [DatabaseTodoRepository, DatabaseUserRepository]
})
export class RepositoriesModule { }
