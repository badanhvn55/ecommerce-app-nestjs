import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TodoM } from "src/domain/model/todo";
import { TodoRepository } from "src/domain/repositories/todoRepository.interface";
import { Todo } from "../config/entities/todo.entity";
import { Repository } from "typeorm";

@Injectable()
export class DatabaseTodoRepository implements TodoRepository {
    constructor(
        @InjectRepository(Todo)
        private readonly todoEntityRepository: Repository<Todo>,
    ) { }

    async insert(todo: TodoM): Promise<TodoM> {
        const todoEntity = this.toTodoEntity(todo);
        const result = await this.todoEntityRepository.insert(todoEntity);
        return this.toTodo(result.generatedMaps[0] as Todo);
    }

    async findAll(): Promise<TodoM[]> {
        const todosEntity = await this.todoEntityRepository.find();
        return todosEntity.map(todoEntity => this.toTodo(todoEntity));
    }

    async findById(id: number): Promise<TodoM> {
        const todoEntity = await this.todoEntityRepository.findOneOrFail({ where: { id } });
        return this.toTodo(todoEntity);
    }

    async updateContent(id: number, isDone: boolean): Promise<void> {
        await this.todoEntityRepository.update(
            { id },
            { isDone },
        );
    }

    async deleteById(id: number): Promise<void> {
        await this.todoEntityRepository.delete({ id });
    }

    private toTodo(todoEntity: Todo): TodoM {
        const todo: TodoM = new TodoM();
        todo.id = todoEntity.id;
        todo.content = todoEntity.content;
        todo.isDone = todoEntity.isDone;
        todo.createdate = todoEntity.createdate;
        todo.updatedate = todoEntity.updatedate;
        return todo;
    }

    private toTodoEntity(todo: TodoM): Todo {
        const todoEntity: Todo = new Todo();
        todoEntity.id = todo.id;
        todoEntity.content = todo.content;
        todoEntity.isDone = todo.isDone;
        return todoEntity;
    }
}