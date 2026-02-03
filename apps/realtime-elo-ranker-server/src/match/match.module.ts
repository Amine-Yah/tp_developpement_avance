import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PlayerModule } from '../player/player.module';
import { Match } from './entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), PlayerModule],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
