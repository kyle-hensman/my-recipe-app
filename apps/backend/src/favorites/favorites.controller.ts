import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    if (
      !createFavoriteDto.userId ||
      !createFavoriteDto.recipeId ||
      !createFavoriteDto.title
    ) {
      throw new BadRequestException('Missing required fields');
    }

    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Optional parameter',
  })
  @ApiQuery({
    name: 'user',
    required: false,
    description: 'Optional parameter',
  })
  findAll(@Query('page') page?: number, @Query('user') userId?: number) {
    if (userId) {
      return this.favoritesService.findAllByUserId(page || 1, userId);
    }
    return this.favoritesService.findAll(page || 1);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Missing required params');
    }

    return this.favoritesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    if (!id) {
      throw new BadRequestException('Missing required params');
    }

    return this.favoritesService.update(+id, updateFavoriteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Missing required params');
    }

    return this.favoritesService.remove(+id);
  }
}
