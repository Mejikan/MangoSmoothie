import dotenv from "dotenv";
dotenv.config();

export class Env {
	public static readonly PROJECT_DIR: string = (process.env.PROJECT_DIR || __dirname);
	public static readonly PORT: number = (process.env.PORT ? parseInt(process.env.PORT, 10) : 8081);

	public static get DB_URI(): string {
		if (!process.env.DB_URI) {
			throw new Error("DB_URI is undefined");
		}
		return process.env.DB_URI;
	}

	public static get DB_USERNAME(): string | null {
		if (!process.env.DB_USERNAME) {
			// throw new Error("DB_USERNAME is undefined");
			return null;
		}
		return process.env.DB_USERNAME;
	}

	public static get DB_PASSWORD(): string | null {
		if (!process.env.DB_PASSWORD) {
			// throw new Error("DB_PASSWORD is undefined");
			return null;
		}
		return process.env.DB_PASSWORD;
	}
}
