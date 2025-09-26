import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { CreateAutomobileDto } from './dto/create-automobile.dto';
import { UpdateAutomobileDto } from './dto/update-automobile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automobile } from './entities/automobile.entity';

@Injectable()
export class VehiclesService {
	constructor(
		@InjectRepository(Automobile)
		private readonly automobileRepository: Repository<Automobile>,
	) {}

	async create(
		createAutomobileDto: CreateAutomobileDto,
	): Promise<Automobile> {
		const existingPlate = await this.automobileRepository.findOne({
			where: { plate: createAutomobileDto.plate },
		});

		if (existingPlate) {
			throw new BadRequestException(
				'Já existe um automóvel com esta placa',
			);
		}

		const existingChassi = await this.automobileRepository.findOne({
			where: { chassi: createAutomobileDto.chassi },
		});

		if (existingChassi) {
			throw new BadRequestException(
				'Já existe um automóvel com este chassi',
			);
		}

		const existingRenavam = await this.automobileRepository.findOne({
			where: { renavam: createAutomobileDto.renavam },
		});

		if (existingRenavam) {
			throw new BadRequestException(
				'Já existe um automóvel com este renavam',
			);
		}

		const automobile =
			this.automobileRepository.create(createAutomobileDto);
		return await this.automobileRepository.save(automobile);
	}

	async findAll(): Promise<Automobile[]> {
		return await this.automobileRepository.find({
			order: {
				createdAt: 'DESC',
			},
		});
	}

	async findOne(id: string): Promise<Automobile> {
		const automobile = await this.automobileRepository.findOne({
			where: { id },
		});

		if (!automobile) {
			throw new NotFoundException(
				`Automóvel com ID ${id} não encontrado`,
			);
		}

		return automobile;
	}

	async update(
		id: string,
		updateAutomobileDto: UpdateAutomobileDto,
	): Promise<Automobile> {
		const existingAutomobile = await this.automobileRepository.findOne({
			where: { id },
		});

		if (!existingAutomobile) {
			throw new NotFoundException(
				`Automóvel com ID ${id} não encontrado`,
			);
		}

		if (
			updateAutomobileDto.plate &&
			updateAutomobileDto.plate !== existingAutomobile.plate
		) {
			const duplicatePlate = await this.automobileRepository.findOne({
				where: { plate: updateAutomobileDto.plate },
			});

			if (duplicatePlate) {
				throw new BadRequestException(
					'Já existe um automóvel com esta placa',
				);
			}
		}

		if (
			updateAutomobileDto.chassi &&
			updateAutomobileDto.chassi !== existingAutomobile.chassi
		) {
			const duplicateChassi = await this.automobileRepository.findOne({
				where: { chassi: updateAutomobileDto.chassi },
			});

			if (duplicateChassi) {
				throw new BadRequestException(
					'Já existe um automóvel com este chassi',
				);
			}
		}

		if (
			updateAutomobileDto.renavam &&
			updateAutomobileDto.renavam !== existingAutomobile.renavam
		) {
			const duplicateRenavam = await this.automobileRepository.findOne({
				where: { renavam: updateAutomobileDto.renavam },
			});

			if (duplicateRenavam) {
				throw new BadRequestException(
					'Já existe um automóvel com este renavam',
				);
			}
		}

		Object.assign(existingAutomobile, updateAutomobileDto);
		return await this.automobileRepository.save(existingAutomobile);
	}

	async remove(id: string): Promise<{ message: string }> {
		const existingAutomobile = await this.automobileRepository.findOne({
			where: { id },
		});

		if (!existingAutomobile) {
			throw new NotFoundException(
				`Automóvel com ID ${id} não encontrado`,
			);
		}

		await this.automobileRepository.delete(id);

		return {
			message: `Automóvel ${existingAutomobile.brand} ${existingAutomobile.model} removido com sucesso`,
		};
	}
}
