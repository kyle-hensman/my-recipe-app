import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";

import { auth } from "./auth";
import { AppController } from "./app.controller";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { RecipesModule } from "./recipes/recipes.module";
import { ScanModule } from "./scan/scan.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({ auth }),
    DrizzleModule,
    FavoritesModule,
    RecipesModule,
    ScanModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
