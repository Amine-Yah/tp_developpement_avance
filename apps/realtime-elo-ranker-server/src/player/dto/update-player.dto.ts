import { PartialType } from '@nestjs/swagger';
import { CreatePlayerDto } from './create-player.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  rank?: number;
}
