import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodosService } from '../todos.service';
import { Todo } from '../entities/todo.entity';
import { NotFoundException } from '@nestjs/common';

const mockTodoRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper : génère un faux UUID
  const mockUuid = '550e8400-e29b-41d4-a716-446655440000';
  const mockUuid2 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

  describe('findAll', () => {
    it('devrait retourner un tableau de todos', async () => {
      const expectedTodos = [{ id: mockUuid, title: 'Test' }];
      mockTodoRepository.find.mockResolvedValue(expectedTodos);

      const result = await service.findAll();

      expect(result).toEqual(expectedTodos);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner une todo si elle existe', async () => {
      const todo = { id: mockUuid, title: 'Test' };
      mockTodoRepository.findOne.mockResolvedValue(todo);

      const result = await service.findOne(mockUuid);

      expect(result).toEqual(todo);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockUuid },
      });
    });

    it("devrait lancer NotFoundException si la todo n'existe pas", async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('devrait créer et retourner une nouvelle todo avec un UUID', async () => {
      const createDto = { title: 'Nouvelle todo', description: 'Test' };
      const createdTodo = { id: mockUuid, ...createDto, isCompleted: false };

      mockTodoRepository.create.mockReturnValue(createdTodo);
      mockTodoRepository.save.mockResolvedValue(createdTodo);

      const result = await service.create(createDto);

      expect(result).toEqual(createdTodo);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(createdTodo);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour et retourner la todo', async () => {
      const existingTodo = {
        id: mockUuid,
        title: 'Ancien',
        isCompleted: false,
      };
      const updateDto = { title: 'Nouveau', isCompleted: true };
      const updatedTodo = { ...existingTodo, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingTodo as Todo);
      mockTodoRepository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(mockUuid, updateDto);

      expect(result).toEqual(updatedTodo);
      expect(repository.save).toHaveBeenCalledWith(updatedTodo);
    });
  });

  describe('remove', () => {
    it('devrait supprimer la todo avec succès', async () => {
      mockTodoRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockUuid);

      expect(repository.delete).toHaveBeenCalledWith(mockUuid);
    });

    it("devrait lancer NotFoundException si la todo n'existe pas", async () => {
      mockTodoRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('invalid-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
