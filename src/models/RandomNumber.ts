import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class RandomNumbers extends BaseEntity {
  @Column({
    nullable: false,
  })
  generated: number;

  @CreateDateColumn()
  createdAt: Date;

  @PrimaryGeneratedColumn()
  id: number;
}
