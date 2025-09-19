import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { Fountain } from './entities/fountains.entity';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomersService', () => {
  let service: CustomersService;
  let customerRepository: jest.Mocked<Repository<Customer>>;
  let fountainRepository: jest.Mocked<Repository<Fountain>>;
  let passwordEncryption: jest.Mocked<PasswordEncryption>;

  const mockCustomer: Customer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'hashedPassword',
    address: 'Rua das Flores, 123',
    rg: '123456789',
    cpf: '12345678901',
    profession: 'Engenheiro',
    roles: [],
    fountains: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastPasswordChange: new Date(),
  };

  const mockFountain: Fountain = {
    id: '456e7890-e89b-12d3-a456-426614174001',
    employerEntity: 'Empresa XYZ',
    output: 5000,
    customer: mockCustomer,
  };

  const mockCreateCustomerDto: CreateCustomerDto = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'Password123!',
    address: 'Rua das Flores, 123',
    rg: '123456789',
    cpf: '12345678901',
    profession: 'Engenheiro',
    fountains: [
      {
        employerEntity: 'Empresa XYZ',
        output: 5000,
      },
    ],
  };

  beforeEach(async () => {
    const mockCustomerRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockFountainRepository = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockPasswordEncryption = {
      encrypt: jest.fn(),
      compare: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        {
          provide: getRepositoryToken(Fountain),
          useValue: mockFountainRepository,
        },
        {
          provide: PasswordEncryption,
          useValue: mockPasswordEncryption,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    customerRepository = module.get(getRepositoryToken(Customer));
    fountainRepository = module.get(getRepositoryToken(Fountain));
    passwordEncryption = module.get(PasswordEncryption);
  });

  describe('create', () => {
    it('deve criar um cliente com sucesso', async () => {
      // Testa: Criação bem-sucedida de cliente com fountains
      customerRepository.findOne.mockResolvedValue(null); // Não existe cliente com CPF/email
      passwordEncryption.encrypt.mockResolvedValue('hashedPassword');
      customerRepository.create.mockReturnValue(mockCustomer);
      customerRepository.save.mockResolvedValue(mockCustomer);
      fountainRepository.create.mockReturnValue(mockFountain);
      fountainRepository.save.mockResolvedValue([mockFountain]);
      customerRepository.findOne.mockResolvedValueOnce(null); // Para CPF
      customerRepository.findOne.mockResolvedValueOnce(null); // Para email
      customerRepository.findOne.mockResolvedValueOnce({ ...mockCustomer, fountains: [mockFountain] }); // Resultado final

      const result = await service.create(mockCreateCustomerDto);

      expect(customerRepository.findOne).toHaveBeenCalledTimes(3);
      expect(passwordEncryption.encrypt).toHaveBeenCalledWith('Password123!');
      expect(customerRepository.save).toHaveBeenCalledWith(mockCustomer);
      expect(fountainRepository.save).toHaveBeenCalled();
      expect(result.fountains).toEqual([mockFountain]);
    });

    it('deve lançar erro se CPF já existir', async () => {
      // Testa: Validação de CPF único
      customerRepository.findOne.mockResolvedValue(mockCustomer);

      await expect(service.create(mockCreateCustomerDto)).rejects.toThrow(
        new BadRequestException('Cliente já existe com este CPF'),
      );
    });

    it('deve lançar erro se email já estiver em uso', async () => {
      // Testa: Validação de email único
      customerRepository.findOne
        .mockResolvedValueOnce(null) // Para CPF
        .mockResolvedValueOnce(mockCustomer); // Para email

      await expect(service.create(mockCreateCustomerDto)).rejects.toThrow(
        new BadRequestException('Email já está em uso'),
      );
    });

    it('deve lançar erro se não conseguir buscar cliente criado', async () => {
      // Testa: Tratamento de erro ao buscar cliente após criação
      customerRepository.findOne.mockResolvedValue(null);
      passwordEncryption.encrypt.mockResolvedValue('hashedPassword');
      customerRepository.create.mockReturnValue(mockCustomer);
      customerRepository.save.mockResolvedValue(mockCustomer);
      customerRepository.findOne
        .mockResolvedValueOnce(null) // Para CPF
        .mockResolvedValueOnce(null) // Para email
        .mockResolvedValueOnce(null); // Resultado final - erro

      await expect(service.create(mockCreateCustomerDto)).rejects.toThrow(
        new BadRequestException('Erro ao buscar cliente criado'),
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os clientes com fountains', async () => {
      // Testa: Busca de todos os clientes com relacionamentos
      const customers = [{ ...mockCustomer, fountains: [mockFountain] }];
      customerRepository.find.mockResolvedValue(customers);

      const result = await service.findAll();

      expect(customerRepository.find).toHaveBeenCalledWith({
        relations: ['fountains'],
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          rg: true,
          cpf: true,
          profession: true,
          roles: true,
          createdAt: true,
          updatedAt: true,
          fountains: true,
        },
      });
      expect(result).toEqual(customers);
    });

    it('deve retornar array vazio quando não há clientes', async () => {
      // Testa: Retorno vazio quando não há dados
      customerRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar um cliente pelo ID', async () => {
      // Testa: Busca de cliente específico por ID
      const customerWithFountains = { ...mockCustomer, fountains: [mockFountain] };
      customerRepository.findOne.mockResolvedValue(customerWithFountains);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        relations: ['fountains'],
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          rg: true,
          cpf: true,
          profession: true,
          roles: true,
          createdAt: true,
          updatedAt: true,
          fountains: true,
        },
      });
      expect(result).toEqual(customerWithFountains);
    });

    it('deve lançar NotFoundException se cliente não existir', async () => {
      // Testa: Tratamento de cliente não encontrado
      customerRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('inexistent-id')).rejects.toThrow(
        new NotFoundException('Cliente com ID inexistent-id não encontrado'),
      );
    });
  });

  describe('update', () => {
    const mockUpdateDto: UpdateCustomerDto = {
      name: 'João Silva Atualizado',
      address: 'Nova Rua, 456',
      fountains: [
        {
          employerEntity: 'Nova Empresa',
          output: 6000,
        },
      ],
    };

    it('deve atualizar um cliente com sucesso', async () => {
      // Testa: Atualização completa de cliente incluindo fountains
      const existingCustomer = { ...mockCustomer, fountains: [mockFountain] };
      const updatedCustomer = { ...mockCustomer, ...mockUpdateDto, fountains: [] };
      
      customerRepository.findOne
        .mockResolvedValueOnce(existingCustomer) // Cliente existente
        .mockResolvedValueOnce(updatedCustomer); // Cliente atualizado
      customerRepository.update.mockResolvedValue(undefined as any);
      fountainRepository.delete.mockResolvedValue(undefined as any);
      fountainRepository.create.mockReturnValue(mockFountain);
      fountainRepository.save.mockResolvedValue([mockFountain]);

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', mockUpdateDto);

      expect(customerRepository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          name: 'João Silva Atualizado',
          address: 'Nova Rua, 456',
        }),
      );
      expect(fountainRepository.delete).toHaveBeenCalledWith({ customer: { id: '123e4567-e89b-12d3-a456-426614174000' } });
      expect(fountainRepository.save).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se cliente não existir', async () => {
      // Testa: Validação de existência do cliente na atualização
      customerRepository.findOne.mockResolvedValue(null);

      await expect(service.update('inexistent-id', mockUpdateDto)).rejects.toThrow(
        new NotFoundException('Cliente com ID inexistent-id não encontrado'),
      );
    });

    it('deve lançar erro se CPF já estiver em uso por outro cliente', async () => {
      // Testa: Validação de CPF único na atualização
      const existingCustomer = { ...mockCustomer, fountains: [] };
      const anotherCustomer = { ...mockCustomer, id: 'another-id', cpf: '99999999999' };
      
      customerRepository.findOne
        .mockResolvedValueOnce(existingCustomer) // Cliente existente
        .mockResolvedValueOnce(anotherCustomer); // Outro cliente com mesmo CPF

      const updateDto = { cpf: '99999999999' };
      
      await expect(service.update('123e4567-e89b-12d3-a456-426614174000', updateDto))
        .rejects.toThrow(new BadRequestException('Já existe um cliente com este CPF'));
    });

    it('deve criptografar nova senha se fornecida', async () => {
      // Testa: Criptografia de senha na atualização
      const existingCustomer = { ...mockCustomer, fountains: [] };
      const updatedCustomer = { ...mockCustomer };
      
      customerRepository.findOne
        .mockResolvedValueOnce(existingCustomer)
        .mockResolvedValueOnce(updatedCustomer);
      passwordEncryption.encrypt.mockResolvedValue('newHashedPassword');
      customerRepository.update.mockResolvedValue(undefined as any);

      const updateDto = { password: 'NewPassword123!' };
      
      await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(passwordEncryption.encrypt).toHaveBeenCalledWith('NewPassword123!');
      expect(customerRepository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        expect.objectContaining({
          password: 'newHashedPassword',
        }),
      );
    });
  });

  describe('remove', () => {
    it('deve remover um cliente com sucesso', async () => {
      // Testa: Remoção completa de cliente e fountains relacionadas
      const existingCustomer = { ...mockCustomer, fountains: [mockFountain] };
      customerRepository.findOne.mockResolvedValue(existingCustomer);
      fountainRepository.delete.mockResolvedValue(undefined as any);
      customerRepository.delete.mockResolvedValue(undefined as any);

      const result = await service.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(customerRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        relations: ['fountains'],
      });
      expect(fountainRepository.delete).toHaveBeenCalledWith({ customer: { id: '123e4567-e89b-12d3-a456-426614174000' } });
      expect(customerRepository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(result).toEqual({
        message: 'Cliente João Silva removido com sucesso',
      });
    });

    it('deve lançar NotFoundException se cliente não existir', async () => {
      // Testa: Validação de existência do cliente na remoção
      customerRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('inexistent-id')).rejects.toThrow(
        new NotFoundException('Cliente com ID inexistent-id não encontrado'),
      );
    });

    it('deve remover cliente mesmo sem fountains', async () => {
      // Testa: Remoção de cliente sem fountains associadas
      const existingCustomer = { ...mockCustomer, fountains: [] };
      customerRepository.findOne.mockResolvedValue(existingCustomer);
      customerRepository.delete.mockResolvedValue(undefined as any);

      const result = await service.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(fountainRepository.delete).not.toHaveBeenCalled();
      expect(customerRepository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(result).toEqual({
        message: 'Cliente João Silva removido com sucesso',
      });
    });
  });

  it('should be defined', () => {
    // Testa: Inicialização do serviço
    expect(service).toBeDefined();
  });
});
