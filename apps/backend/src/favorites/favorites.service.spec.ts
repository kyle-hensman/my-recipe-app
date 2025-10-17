import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { FavoritesService } from "./favorites.service";
import { DrizzleModule } from "../drizzle/drizzle.module";

describe("FavoritesService", () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DrizzleModule],
      providers: [FavoritesService],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
