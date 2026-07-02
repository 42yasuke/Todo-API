import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from '../todos.controller';
import { TodosService } from '../todos.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

const mockTodosService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  const mockUuid = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('devrait appeler service.findAll', async () => {
      const expected = [{ id: mockUuid, title: 'Test' }];
      mockTodosService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait appeler service.findOne avec un string UUID', async () => {
      const todo = { id: mockUuid, title: 'Test' };
      mockTodosService.findOne.mockResolvedValue(todo);

      const result = await controller.findOne(mockUuid);

      expect(result).toEqual(todo);
      expect(service.findOne).toHaveBeenCalledWith(mockUuid);
    });
  });

  describe('create', () => {
    it('devrait appeler service.create avec le DTO', async () => {
      const dto: CreateTodoDto = { title: 'Nouveau', description: 'Desc' };
      const created = { id: mockUuid, ...dto, isCompleted: false };
      mockTodosService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(result).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('devrait appeler service.update avec id et DTO', async () => {
      const dto: UpdateTodoDto = { title: 'Mis à jour' };
      const updated = { id: mockUuid, title: 'Mis à jour', isCompleted: false };
      mockTodosService.update.mockResolvedValue(updated);

      const result = await controller.update(mockUuid, dto);

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(mockUuid, dto);
    });
  });

  describe('remove', () => {
    it('devrait appeler service.remove avec id', async () => {
      mockTodosService.remove.mockResolvedValue(undefined);

      await controller.remove(mockUuid);

      expect(service.remove).toHaveBeenCalledWith(mockUuid);
    });
  });
});
