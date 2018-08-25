import express from "express";
import { MangoSmoothie } from "@cz/mangoSmoothie/mangoSmoothie";

export class Route {
	protected mangoSmoothie: MangoSmoothie | null = null;
	protected router: express.Router;
	protected readonly basePath: string;

	constructor(basePath: string) {
		this.basePath = basePath;
		this.router = express.Router();
	}

	public init(mangoSmoothie: MangoSmoothie): void {
		this.mangoSmoothie = mangoSmoothie;
		this.mangoSmoothie.express.use(this.basePath, this.router);
		this.mangoSmoothie.routes.set(this.basePath, this);
	}
}
