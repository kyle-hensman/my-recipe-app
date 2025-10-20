import { Module } from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { RecipesController } from "./recipes.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [DrizzleModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
