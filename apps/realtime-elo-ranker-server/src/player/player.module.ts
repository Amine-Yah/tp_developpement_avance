import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { NoSQLService } from '../common/nosql.service';

@Module({
  providers: [PlayerService, NoSQLService],
  controllers: [PlayerController],
  exports: [PlayerService, NoSQLService],
})
export class PlayerModule {}
