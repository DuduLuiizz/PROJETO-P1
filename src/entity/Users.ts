import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Situation } from "./Situations";
import bcrypt from "bcryptjs";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @ManyToOne(() => Situation, (situation) => situation.users)
    @JoinColumn({ name: "situationId" })
    situation!: Situation;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
