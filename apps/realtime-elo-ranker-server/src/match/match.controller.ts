import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';

@ApiTags('match')
@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiResponse({ status: 200, description: 'Résultats du match publiés avec succès' })
  @ApiResponse({ status: 422, description: "Soit le gagnant, soit le perdant indiqué n'existe pas" })
  publishMatchResult(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.publishMatchResult(createMatchDto);
  }
}
