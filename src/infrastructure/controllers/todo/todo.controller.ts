import { Body, Controller, Delete, Get, Inject, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TodoPresenter } from "./todo.presenter";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { getTodoUseCases } from "src/usecases/todo/getTodo.usecases";
import { addTodoUseCases } from "src/usecases/todo/addTodo.usecases";
import { deleteTodoUseCases } from "src/usecases/todo/deleteTodo.usecases";
import { updateTodoUseCases } from "src/usecases/todo/updateTodo.usecases";
import { getTodosUseCases } from "src/usecases/todo/getTodos.usecases";
import { ApiResponseType } from "src/infrastructure/common/swagger/response.decorator";
import { AddTodoDto, UpdateTodoDto } from "./todo.dto";

@Controller('todo')
@ApiTags('todo')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(TodoPresenter)
export class TodoController {
    constructor(
        @Inject(UsecasesProxyModule.GET_TODO_USECASES_PROXY)
        private readonly getTodoUsecaseProxy: UseCaseProxy<getTodoUseCases>,
        @Inject(UsecasesProxyModule.GET_TODOS_USECASES_PROXY)
        private readonly getAllTodoUsecaseProxy: UseCaseProxy<getTodosUseCases>,
        @Inject(UsecasesProxyModule.PUT_TODO_USECASES_PROXY)
        private readonly updateTodoUsecaseProxy: UseCaseProxy<updateTodoUseCases>,
        @Inject(UsecasesProxyModule.DELETE_TODO_USECASES_PROXY)
        private readonly deleteTodoUsecaseProxy: UseCaseProxy<deleteTodoUseCases>,
        @Inject(UsecasesProxyModule.POST_TODO_USECASES_PROXY)
        private readonly addTodoUsecaseProxy: UseCaseProxy<addTodoUseCases>,
    ) { }

    @Get('todo')
    @ApiResponseType(TodoPresenter, false)
    async getTodo(@Query('id', ParseIntPipe) id: number) {
        const todo = await this.getTodoUsecaseProxy.getInstance().execute(id);
        return new TodoPresenter(todo);
    }

    @Get('todos')
    @ApiResponseType(TodoPresenter, true)
    async getTodos() {
        const todo = await this.getAllTodoUsecaseProxy.getInstance().execute();
        return todo.map(todo => new TodoPresenter(todo));
    }

    @Put('todo')
    @ApiResponseType(TodoPresenter, true)
    async updateTodo(@Body() updateTodo: UpdateTodoDto) {
        const { id, isDone } = updateTodo;
        await this.updateTodoUsecaseProxy.getInstance().execute(id, isDone);
        return 'success';
    }

    @Delete('todo')
    @ApiResponseType(TodoPresenter, true)
    async deleteTodo(@Query('id', ParseIntPipe) id: number) {
        await this.deleteTodoUsecaseProxy.getInstance().execute(id);
        return 'success';
    }

    @Post('todo')
    @ApiResponseType(TodoPresenter, true)
    async addTodo(@Body() addTodo: AddTodoDto) {
        const { content } = addTodo;
        const todoCreated = await this.addTodoUsecaseProxy.getInstance().execute(content);
        return new TodoPresenter(todoCreated);
    }
}