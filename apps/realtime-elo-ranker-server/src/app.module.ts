import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { RankingModule } from './ranking/ranking.module';
import { AutoMatchModule } from './auto-match/auto-match.module';
import { Player } from './player/entities/player.entity';
import { Match } from './match/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/elo-ranker.db',
      entities: [Player, Match],
      synchronize: true,
      logging: false,
    }),
    EventEmitterModule.forRoot(),
    PlayerModule,
    MatchModule,
    RankingModule,
    AutoMatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
