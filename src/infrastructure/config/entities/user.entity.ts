import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column('varchar', { unique: true })
    username: string;

    @Column('text')
    password: string;

    @CreateDateColumn({ name: 'createdate' })
    createdate: Date;

    @UpdateDateColumn({ name: 'updatedate' })
    updatedate: Date;

    @Column({ nullable: true })
    last_login?: Date;

    @Column('varchar', { nullable: true })
    hach_refresh_token: string;
}