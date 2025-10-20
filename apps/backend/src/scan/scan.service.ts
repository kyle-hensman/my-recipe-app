import dotenv from "dotenv";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ExtractedRecipeDto } from "./dto/extracted-recipe";
import { ServiceResponseDto } from "../common/types/service-response.dto";

dotenv.config();

@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);
  private vision_api_url: string;
  private vision_api_key: string;

  constructor(private readonly configService: ConfigService) {
    this.vision_api_url =
      this.configService.get<string>("IMAGE_TO_TEXT_API_URL") || "";
    this.vision_api_key =
      this.configService.get<string>("IMAGE_TO_TEXT_API_KEY") || "";
  }

  async extractRecipeFromImage(
    file: Express.Multer.File,
  ): Promise<ServiceResponseDto<ExtractedRecipeDto>> {
    try {
      const base64String = file.buffer.toString("base64");
      const dataUrlString = `data:${file.mimetype};base64,${base64String}`;

      if (!file) {
        return Promise.resolve({
          success: false,
          error: Error("Missing file parameters"),
          data: null,
        });
      }

      const imageToTextResponse = await fetch(`${this.vision_api_url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.vision_api_key}`,
        },
        body: JSON.stringify({
          base64: base64String,
          dataUrl: dataUrlString,
        }),
      });
      const imageToTextResponseJson = await imageToTextResponse.json();
      console.log("response: ", imageToTextResponseJson);

      if (!imageToTextResponse || !imageToTextResponseJson) {
        return Promise.resolve({
          success: false,
          error: Error("Missing response from image to text conversion."),
          data: null,
        });
      }

      return Promise.resolve({
        success: true,
        error: null,
        data: null,
      });
    } catch (error) {
      console.error(error);
      return Promise.resolve({
        success: false,
        error: Error("Missing file parameters"),
        data: null,
      });
    }
  }
}
