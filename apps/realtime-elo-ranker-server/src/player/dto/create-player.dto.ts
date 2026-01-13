import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ description: "L'identifiant du joueur" })
  @IsString()
  @IsNotEmpty()
  id: string;
}
