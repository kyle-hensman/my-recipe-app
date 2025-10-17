import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";

import { AppController } from "./app.controller";
import { DrizzleModule } from "./drizzle/drizzle.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { auth } from "./auth";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({ auth }),
    DrizzleModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
