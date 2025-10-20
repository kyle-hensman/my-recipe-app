import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

import { ScanService } from "./scan.service";

@Controller("scan")
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post()
  @AllowAnonymous()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 10 * 1024 * 1024 * 100, // 1000MB limit
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException("Only image files are allowed"),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async scanRecipe(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No image file provided");
    }

    try {
      const recipe = await this.scanService.extractRecipeFromImage(file);
      return {
        success: true,
        data: recipe,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        "Failed to process image: ${error.message}",
      );
    }
  }
}
