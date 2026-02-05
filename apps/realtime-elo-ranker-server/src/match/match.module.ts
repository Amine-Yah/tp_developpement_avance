import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PlayerModule } from '../player/player.module';
import { NoSQLService } from '../common/nosql.service';

@Module({
  imports: [PlayerModule],
  controllers: [MatchController],
  providers: [MatchService, NoSQLService],
  exports: [MatchService],
})
export class MatchModule {}
