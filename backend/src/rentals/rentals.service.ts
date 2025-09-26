import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rent } from './entities/rent.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Automobile } from 'src/vehicles/entities/automobile.entity';
import { OrderStatus } from 'src/vehicles/entities/order-status.enum';

@Injectable()
export class RentalsService {
	constructor(
		@InjectRepository(Rent)
		private readonly rentRepository: Repository<Rent>,
		@InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
		@InjectRepository(Automobile)
		private readonly automobileRepository: Repository<Automobile>,
	) {}

	async create(createRentDto: CreateRentDto): Promise<Rent> {
		const customer = await this.customerRepository.findOne({
			where: { id: createRentDto.customerId },
			relations: ['individual'],
		});

		if (!customer) {
			throw new NotFoundException(
				`Cliente com ID ${createRentDto.customerId} não encontrado`,
			);
		}

		const automobile = await this.automobileRepository.findOne({
			where: { id: createRentDto.automobileId },
		});

		if (!automobile) {
			throw new NotFoundException(
				`Automóvel com ID ${createRentDto.automobileId} não encontrado`,
			);
		}

		const existingRent = await this.rentRepository.findOne({
			where: {
				automobile: { id: createRentDto.automobileId },
				status: OrderStatus.APPROVED,
			},
		});

		if (existingRent) {
			throw new BadRequestException(
				'Este automóvel já está sendo alugado',
			);
		}

		const rent = this.rentRepository.create({
			client: customer,
			automobile: automobile,
			value: createRentDto.value,
			status: createRentDto.status || OrderStatus.ON_ANALYSIS,
			data: new Date(),
		});

		return await this.rentRepository.save(rent);
	}

	async findAll(): Promise<Rent[]> {
		return await this.rentRepository.find({
			relations: ['client', 'client.individual', 'automobile'],
			select: {
				id: true,
				data: true,
				status: true,
				value: true,
				createdAt: true,
				updatedAt: true,
				client: {
					id: true,
					individual: {
						id: true,
						name: true,
						email: true,
						cpf: true,
					},
				},
				automobile: {
					id: true,
					plate: true,
					brand: true,
					model: true,
				},
			},
		});
	}

	async findOne(id: string): Promise<Rent> {
		const rent = await this.rentRepository.findOne({
			where: { id },
			relations: ['client', 'client.individual', 'automobile'],
			select: {
				id: true,
				data: true,
				status: true,
				value: true,
				createdAt: true,
				updatedAt: true,
				client: {
					id: true,
					individual: {
						id: true,
						name: true,
						email: true,
						cpf: true,
						address: true,
					},
				},
				automobile: {
					id: true,
					plate: true,
					brand: true,
					model: true,
					chassi: true,
					renavam: true,
				},
			},
		});

		if (!rent) {
			throw new NotFoundException(`Aluguel com ID ${id} não encontrado`);
		}

		return rent;
	}

	async findByCustomer(customerId: string): Promise<Rent[]> {
		const customer = await this.customerRepository.findOne({
			where: { id: customerId },
		});

		if (!customer) {
			throw new NotFoundException(
				`Cliente com ID ${customerId} não encontrado`,
			);
		}

		return await this.rentRepository.find({
			where: { client: { id: customerId } },
			relations: ['automobile'],
			select: {
				id: true,
				data: true,
				status: true,
				value: true,
				createdAt: true,
				updatedAt: true,
				automobile: {
					id: true,
					plate: true,
					brand: true,
					model: true,
				},
			},
			order: {
				createdAt: 'DESC',
			},
		});
	}

	async update(id: string, updateRentDto: UpdateRentDto): Promise<Rent> {
		const existingRent = await this.rentRepository.findOne({
			where: { id },
			relations: ['client', 'automobile'],
		});

		if (!existingRent) {
			throw new NotFoundException(`Aluguel com ID ${id} não encontrado`);
		}

		if (
			updateRentDto.status === OrderStatus.APPROVED &&
			existingRent.status !== OrderStatus.APPROVED
		) {
			const conflictingRent = await this.rentRepository.findOne({
				where: {
					automobile: { id: existingRent.automobile.id },
					status: OrderStatus.APPROVED,
				},
			});

			if (conflictingRent && conflictingRent.id !== id) {
				throw new BadRequestException(
					'Este automóvel já está sendo alugado por outro cliente',
				);
			}
		}

		Object.assign(existingRent, updateRentDto);

		return await this.rentRepository.save(existingRent);
	}

	async remove(id: string): Promise<{ message: string }> {
		const existingRent = await this.rentRepository.findOne({
			where: { id },
			relations: ['client', 'client.individual'],
		});

		if (!existingRent) {
			throw new NotFoundException(`Aluguel com ID ${id} não encontrado`);
		}

		await this.rentRepository.delete(id);

		const clientName = existingRent.client.individual?.name || 'Cliente';

		return {
			message: `Aluguel de ${clientName} removido com sucesso`,
		};
	}
}
