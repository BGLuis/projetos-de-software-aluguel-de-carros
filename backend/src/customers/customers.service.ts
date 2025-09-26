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
import { Individual } from 'src/users/entities/individual.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CustomersService {
	constructor(
		@InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
		@InjectRepository(Fountain)
		private readonly fountainRepository: Repository<Fountain>,
		@InjectRepository(Individual)
		private readonly individualRepository: Repository<Individual>,
		private readonly passwordEncryption: PasswordEncryption,
		private readonly jwtService: JwtService,
		private eventEmitter: EventEmitter2,
	) {}

	async create(dto: CreateCustomerDto): Promise<Customer> {
		try {
			// Verificar se já existe um individual com esse CPF
			const existingIndividual = await this.individualRepository.findOne({
				where: { cpf: dto.cpf },
			});

			if (existingIndividual) {
				throw new BadRequestException('Cliente já existe com este CPF');
			}

			// Verificar se já existe um usuário com esse email
			const existingUser = await this.individualRepository.findOne({
				where: { email: dto.email },
			});

			if (existingUser) {
				throw new BadRequestException('Email já está em uso');
			}

			// Criptografar a senha
			const hashedPassword = await this.passwordEncryption.encrypt(
				dto.password,
			);

			// Criar o individual
			const individual = this.individualRepository.create({
				name: dto.name,
				email: dto.email,
				password: hashedPassword,
				address: dto.address,
				cpf: dto.cpf,
				profession: dto.profession,
				birthdate: new Date(), // Você pode adicionar este campo ao DTO se necessário
				roles: [], // Inicializar com array vazio
			});

			// Salvar o individual primeiro
			const savedIndividual =
				await this.individualRepository.save(individual);

			// Criar o customer associado ao individual
			const customer = this.customerRepository.create({
				individual: savedIndividual,
			});

			// Salvar o customer
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

			// Retornar o customer com as relações
			const result = await this.customerRepository.findOne({
				where: { id: savedCustomer.id },
				relations: ['individual', 'fountains'],
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
			relations: ['individual', 'legalEntity', 'fountains'],
			select: {
				id: true,
				createdAt: true,
				updatedAt: true,
				individual: {
					id: true,
					name: true,
					email: true,
					address: true,
					cpf: true,
					profession: true,
					birthdate: true,
					roles: true,
					createdAt: true,
					updatedAt: true,
				},
				legalEntity: {
					id: true,
					cnpj: true,
					companyName: true,
					createdAt: true,
					updatedAt: true,
				},
				fountains: true,
			},
		});
	}

	async findOne(id: string): Promise<Customer> {
		const customer = await this.customerRepository.findOne({
			where: { id },
			relations: ['individual', 'legalEntity', 'fountains'],
			select: {
				id: true,
				createdAt: true,
				updatedAt: true,
				individual: {
					id: true,
					name: true,
					email: true,
					address: true,
					cpf: true,
					profession: true,
					birthdate: true,
					roles: true,
					createdAt: true,
					updatedAt: true,
				},
				legalEntity: {
					id: true,
					cnpj: true,
					companyName: true,
					createdAt: true,
					updatedAt: true,
				},
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
			relations: ['individual', 'fountains'],
		});

		if (!existingCustomer) {
			throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
		}

		if (!existingCustomer.individual) {
			throw new BadRequestException(
				'Cliente não possui dados de pessoa física',
			);
		}

		// Se está atualizando o CPF, verificar se não existe outro individual com o mesmo CPF
		if (
			updateCustomerDto.cpf &&
			updateCustomerDto.cpf !== existingCustomer.individual.cpf
		) {
			const individualWithCpf = await this.individualRepository.findOne({
				where: { cpf: updateCustomerDto.cpf },
			});

			if (individualWithCpf) {
				throw new BadRequestException(
					'Já existe um cliente com este CPF',
				);
			}
		}

		// Se está atualizando o email, verificar se não existe outro usuário com o mesmo email
		if (
			updateCustomerDto.email &&
			updateCustomerDto.email !== existingCustomer.individual.email
		) {
			const userWithEmail = await this.individualRepository.findOne({
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

		// Preparar dados para atualização do individual
		const { fountains, ...updateFields } = updateCustomerDto;
		const updateData = {
			...updateFields,
			...(hashedPassword && { password: hashedPassword }),
		};

		// Atualizar o individual
		await this.individualRepository.update(
			existingCustomer.individual.id,
			updateData,
		);

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
		return this.findOne(id);
	}

	async remove(id: string): Promise<{ message: string; }> {
		// Verificar se o customer existe
		const existingCustomer = await this.customerRepository.findOne({
			where: { id },
			relations: ['individual', 'fountains'],
		});

		if (!existingCustomer) {
			throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
		}

		// Remover primeiro as fountains (devido à relação FK)
		if (
			existingCustomer.fountains &&
			existingCustomer.fountains.length > 0
		) {
			await this.fountainRepository.delete({ customer: { id } });
		}

		// Remover o customer
		await this.customerRepository.delete(id);

		// Remover o individual se existir
		if (existingCustomer.individual) {
			await this.individualRepository.delete(
				existingCustomer.individual.id,
			);
		}

		const clientName = existingCustomer.individual?.name || 'Cliente';

		return {
			message: `Cliente ${clientName} removido com sucesso`,
		};
	}
}
