import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { LegalEntity } from 'src/customers/entities/legal-entity.entity';

@Entity('agents')
export class Agent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => LegalEntity)
    @JoinColumn()
    legalEntity: LegalEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    evaluateRequest(approval: boolean, name: string): void {
        // Implementation for evaluating request
        console.log(
            `Evaluating request: ${approval ? 'approved' : 'rejected'} by ${name}`,
        );
    }

    notifyRefusal(): void {
        // Implementation for notifying refusal
    }
}
