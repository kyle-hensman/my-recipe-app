import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';

describe('FavoritesController', () => {
  let controller: FavoritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DrizzleModule],
      controllers: [FavoritesController],
      providers: [FavoritesService],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
