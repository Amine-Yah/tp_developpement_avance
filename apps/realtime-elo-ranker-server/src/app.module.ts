import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { RankingModule } from './ranking/ranking.module';
import { AutoMatchModule } from './auto-match/auto-match.module';
import { NoSQLService } from './common/nosql.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PlayerModule,
    MatchModule,
    RankingModule,
    AutoMatchModule,
  ],
  controllers: [AppController],
  providers: [AppService, NoSQLService],
})
export class AppModule {}
