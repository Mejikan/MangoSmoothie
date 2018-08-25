import dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

import { Env } from "@cz/mangoSmoothie/env";
import { Route } from "@cz/mangoSmoothie/route";
import { MongoDBRoute } from "@cz/mangoSmoothie/route/mongodbRoute";

export class MangoSmoothie {
	public static init: MangoSmoothie;

	public static main(): void {
		const mangoSmoothie = new MangoSmoothie();
		MangoSmoothie.init = mangoSmoothie;
		mangoSmoothie.initDatabase().then(() => {
			mangoSmoothie.initMiddleware();
			mangoSmoothie.initRoutes();
			mangoSmoothie.listen();
		});
	}

	public routes: Map<string, Route>;
	public express: express.Application;

	// database
	public mongoClient!: MongoClient;

	constructor() {
		dotenv.config();
		this.routes = new Map();
		this.express = express();
	}

	public async initDatabase(): Promise<void> {
		// const mongoDBURIPartial = `${Env.DB_USERNAME}:${Env.DB_PASSWORD}@${Env.DB_URI}`;
		const mongoDBURIPartial = `${Env.DB_URI}`;
		this.mongoClient = await MongoClient.connect(`mongodb://${mongoDBURIPartial}`);

		console.info(`Connected to MongoDB as ${Env.DB_USERNAME}@${Env.DB_URI}`);
	}

	public initMiddleware(): void {
		this.express.use(logger("dev"));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: true }));
	}

	public initRoutes(): void {
		new MongoDBRoute().init(this);
	}

	public listen(): void {
		this.express.listen(Env.PORT || 8081);

		console.log("Server running on port " + (Env.PORT || 8081));
	}
}

MangoSmoothie.main();
