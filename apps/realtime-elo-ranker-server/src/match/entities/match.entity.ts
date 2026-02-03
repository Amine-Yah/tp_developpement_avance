import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1Id: string;

  @Column()
  player2Id: string;

  @Column()
  result: 'player1' | 'player2' | 'draw';

  @Column()
  player1OldRank: number;

  @Column()
  player2OldRank: number;

  @Column()
  player1NewRank: number;

  @Column()
  player2NewRank: number;

  @CreateDateColumn()
  timestamp: Date;
}
