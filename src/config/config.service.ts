import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  constructor() {
    const { error, parsed } = config();
    if (error) {
      throw new Error('Не найден файл .env')
    }
    if (!parsed) {
      throw new Error('Файл .env пуст')
    }
    this.config = parsed;
  }

  get(key: string): string {
    console.log(key);

    const res = this.config[key];
    if (!res) {
      console.log(key);

      throw new Error("Нет такого ключа")
    }
    return res
  }

}