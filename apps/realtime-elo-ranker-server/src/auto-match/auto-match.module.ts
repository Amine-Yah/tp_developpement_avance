import { Module } from '@nestjs/common';
import { AutoMatchService } from './auto-match.service';
import { AutoMatchController } from './auto-match.controller';
import { PlayerModule } from '../player/player.module';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [PlayerModule, MatchModule],
  providers: [AutoMatchService],
  controllers: [AutoMatchController],
  exports: [AutoMatchService],
})
export class AutoMatchModule {}
