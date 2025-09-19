import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Fountain } from './entities/fountains.entity';
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Fountain)
    private readonly fountainRepository: Repository<Fountain>,
    private readonly passwordEncryption: PasswordEncryption,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    try {
      // Verificar se já existe um customer com esse CPF
      const existingCustomer = await this.customerRepository.findOne({
        where: { cpf: dto.cpf },
      });

      if (existingCustomer) {
        throw new BadRequestException('Cliente já existe com este CPF');
      }

      // Verificar se já existe um usuário com esse email
      const existingUser = await this.customerRepository.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email já está em uso');
      }

      // Criptografar a senha
      const hashedPassword = await this.passwordEncryption.encrypt(
        dto.password,
      );

      // Criar o customer
      const customer = this.customerRepository.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        address: dto.address,
        rg: dto.rg,
        cpf: dto.cpf,
        profession: dto.profession,
        roles: [], // Inicializar com array vazio
      });

      // Salvar o customer primeiro
      const savedCustomer = await this.customerRepository.save(customer);

      // Criar e salvar as fountains
      if (dto.fountains && dto.fountains.length > 0) {
        const fountains = dto.fountains.map((fountainDto) =>
          this.fountainRepository.create({
            employerEntity: fountainDto.employerEntity,
            output: fountainDto.output,
            customer: savedCustomer,
          }),
        );

        await this.fountainRepository.save(fountains);
      }

      // Retornar o customer com as fountains
      const result = await this.customerRepository.findOne({
        where: { id: savedCustomer.id },
        relations: ['fountains'],
      });

      if (!result) {
        throw new BadRequestException('Erro ao buscar cliente criado');
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar cliente');
    }
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
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
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
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

    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    // Verificar se o customer existe
    const existingCustomer = await this.customerRepository.findOne({
      where: { id },
      relations: ['fountains'],
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Se está atualizando o CPF, verificar se não existe outro cliente com o mesmo CPF
    if (
      updateCustomerDto.cpf &&
      updateCustomerDto.cpf !== existingCustomer.cpf
    ) {
      const customerWithCpf = await this.customerRepository.findOne({
        where: { cpf: updateCustomerDto.cpf },
      });

      if (customerWithCpf) {
        throw new BadRequestException('Já existe um cliente com este CPF');
      }
    }

    // Se está atualizando o email, verificar se não existe outro usuário com o mesmo email
    if (
      updateCustomerDto.email &&
      updateCustomerDto.email !== existingCustomer.email
    ) {
      const userWithEmail = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (userWithEmail) {
        throw new BadRequestException('Email já está em uso');
      }
    }

    // Criptografar nova senha se fornecida
    let hashedPassword: string | undefined;
    if (updateCustomerDto.password) {
      hashedPassword = await this.passwordEncryption.encrypt(
        updateCustomerDto.password,
      );
    }

    // Preparar dados para atualização (sem fountains)
    const { fountains, ...updateFields } = updateCustomerDto;
    const updateData = {
      ...updateFields,
      password: hashedPassword || existingCustomer.password,
    };

    // Atualizar o customer
    await this.customerRepository.update(id, updateData);

    // Se há fountains para atualizar, primeiro remover as existentes e criar as novas
    if (fountains !== undefined) {
      // Remover fountains existentes
      await this.fountainRepository.delete({ customer: { id } });

      // Criar novas fountains
      if (fountains.length > 0) {
        const newFountains = fountains.map((fountainDto) =>
          this.fountainRepository.create({
            employerEntity: fountainDto.employerEntity,
            output: fountainDto.output,
            customer: existingCustomer,
          }),
        );

        await this.fountainRepository.save(newFountains);
      }
    }

    // Retornar o customer atualizado
    const updatedCustomer = await this.customerRepository.findOne({
      where: { id },
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

    if (!updatedCustomer) {
      throw new NotFoundException('Erro ao buscar cliente atualizado');
    }

    return updatedCustomer;
  }

  async remove(id: string): Promise<{ message: string; }> {
    // Verificar se o customer existe
    const existingCustomer = await this.customerRepository.findOne({
      where: { id },
      relations: ['fountains'],
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Remover primeiro as fountains (devido à relação FK)
    if (existingCustomer.fountains && existingCustomer.fountains.length > 0) {
      await this.fountainRepository.delete({ customer: { id } });
    }

    // Remover o customer
    await this.customerRepository.delete(id);

    return {
      message: `Cliente ${existingCustomer.name} removido com sucesso`,
    };
  }
}
