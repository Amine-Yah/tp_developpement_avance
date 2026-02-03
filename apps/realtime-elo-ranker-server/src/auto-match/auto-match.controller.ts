import { Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AutoMatchService } from './auto-match.service';

@ApiTags('auto-match')
@Controller('api/auto-match')
export class AutoMatchController {
  constructor(private readonly autoMatchService: AutoMatchService) {}

  @Post('start')
  @ApiResponse({
    status: 200,
    description: 'Matches automatiques démarrés avec succès',
  })
  startAutoMatches(@Param() params?: { interval?: string }) {
    const interval = params?.interval ? parseInt(params.interval) : 5000;
    this.autoMatchService.startAutoMatches(interval);
    return {
      message: 'Matches automatiques démarrés',
      interval: interval,
    };
  }

  @Post('stop')
  @ApiResponse({
    status: 200,
    description: 'Matches automatiques arrêtés avec succès',
  })
  stopAutoMatches() {
    this.autoMatchService.stopAutoMatches();
    return { message: 'Matches automatiques arrêtés' };
  }

  @Get('status')
  @ApiResponse({
    status: 200,
    description: 'État des matches automatiques',
  })
  getStatus() {
    return this.autoMatchService.getStatus();
  }
}
