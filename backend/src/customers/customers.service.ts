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
			const existingCustomer = await this.customerRepository.findOne({
				where: { email: dto.email },
			});

			if (existingCustomer) {
				throw new BadRequestException('Email já está em uso');
			}

			const existingIndividual = await this.individualRepository.findOne({
				where: { cpf: dto.cpf },
			});

			if (existingIndividual) {
				throw new BadRequestException('Cliente já existe com este CPF');
			}

			const hashedPassword = await this.passwordEncryption.encrypt(
				dto.password,
			);

			// Criar o Individual separadamente
			const individual = this.individualRepository.create({
				password: hashedPassword,
				address: dto.address,
				cpf: dto.cpf,
				profession: dto.profession,
			});

			const savedIndividual =
				await this.individualRepository.save(individual);

			// Criar o Customer com herança de User
			const customer = this.customerRepository.create({
				email: dto.email,
				password: hashedPassword,
				individual: savedIndividual,
			});

			const savedCustomer = await this.customerRepository.save(customer);

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
				email: true,
				roles: true,
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
				email: true,
				roles: true,
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

		let hashedPassword: string | undefined;
		if (updateCustomerDto.password) {
			hashedPassword = await this.passwordEncryption.encrypt(
				updateCustomerDto.password,
			);
		}

		const { fountains, ...updateFields } = updateCustomerDto;
		const updateData = {
			...updateFields,
			...(hashedPassword && { password: hashedPassword }),
		};

		await this.individualRepository.update(
			existingCustomer.individual.id,
			updateData,
		);

		if (fountains !== undefined) {
			await this.fountainRepository.delete({ customer: { id } });

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

		return this.findOne(id);
	}

	async remove(id: string): Promise<{ message: string }> {
		const existingCustomer = await this.customerRepository.findOne({
			where: { id },
			relations: ['individual', 'fountains'],
		});

		if (!existingCustomer) {
			throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
		}

		if (
			existingCustomer.fountains &&
			existingCustomer.fountains.length > 0
		) {
			await this.fountainRepository.delete({ customer: { id } });
		}

		await this.customerRepository.delete(id);

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
