import { Request, Response } from "express";

import { Route } from "@cz/mangoSmoothie/route";
import { MangoSmoothie } from "@cz/mangoSmoothie/mangoSmoothie";
import { MongoClient, Db, Collection } from "mongodb";

export class MongoDBRoute extends Route {

	private mongoClient: MongoClient;

	constructor() {
		super("/mongodb");

		this.mongoClient = MangoSmoothie.init.mongoClient;
	}

	public init(mangoSmoothie: MangoSmoothie): void {
		super.init(mangoSmoothie);

		this.router.put("/:db/:collection", (req: Request, res: Response) => { this.create(req, res); });
		this.router.get("/:db/:collection", (req: Request, res: Response) => { this.read(req, res); });
		this.router.post("/:db/:collection", (req: Request, res: Response) => { this.update(req, res); });
		this.router.delete("/:db/:collection", (req: Request, res: Response) => { this.delete(req, res); });
	}

	private async create(req: Request, res: Response): Promise<void> {
		const dbName = req.params.db;
		const collectionName = req.params.collection;

		const collection: Collection | undefined = this.getCollection(dbName, collectionName);

		if (!collection) {
			res.status(400).end();
			return;
		}

		try {
			const result = await collection.insertOne(req.body);
			if (result.insertedCount > 0) {
				res.status(200).end(JSON.stringify(result));
			} else {
				res.status(500).end();
			}
		} catch (err) {
			console.log("Request body is: ", req.body);
			console.error(err);
			res.status(500).end(err);
		}
	}

	private async read(req: Request, res: Response): Promise<void> {
		const dbName = req.params.db;
		const collectionName = req.params.collection;

		const collection: Collection | undefined = this.getCollection(dbName, collectionName);

		if (!collection) {
			res.status(400).end();
			return;
		}

		try {
			const arr = await collection.find(req.query).toArray();
			if (arr) {
				res.status(200).end(JSON.stringify(arr));
			} else {
				res.status(200).end(JSON.stringify([]));
			}
		} catch (err) {
			console.log("Request query is: ", req.query);
			console.error(err);
			res.status(500).end(err);
		}
	}

	private async update(req: Request, res: Response): Promise<void> {
		const dbName = req.params.db;
		const collectionName = req.params.collection;

		const collection: Collection | undefined = this.getCollection(dbName, collectionName);

		if (!collection) {
			res.status(400).end();
			return;
		}

		const filter = req.body.filter;
		const update = req.body.update;
		if (!filter || !update) {
			console.log("Bad request: ", req.body);
			res.status(400).end();
			return;
		}

		try {
			const result = await collection.updateMany(filter, update);
			res.status(200).end(JSON.stringify(result));
		} catch (err) {
			console.log("Request body is: ", req.body);
			console.error(err);
			res.status(500).end(err);
		}
	}

	private async delete(req: Request, res: Response): Promise<void> {
		const dbName = req.params.db;
		const collectionName = req.params.collection;

		const collection: Collection | undefined = this.getCollection(dbName, collectionName);

		if (!collection) {
			res.status(400).end();
			return;
		}

		try {
			const result = await collection.deleteMany(req.body);
			res.status(200).end(JSON.stringify(result));
		} catch (err) {
			console.log("Request body is: ", req.body);
			console.error(err);
			res.status(500).end(err);
		}
	}

	private getCollection(dbName: string, collectionName: string): Collection | undefined {
		if (!(dbName && dbName.trim().length > 0)) {
			return undefined;
		}

		if (dbName.toLowerCase() === "admin" || dbName.toLowerCase() === "local" || dbName.toLowerCase() === "config") {
			return undefined;
		}

		if (!(collectionName && collectionName.trim().length > 0)) {
			return undefined;
		}

		const db: Db = this.mongoClient.db(dbName);
		if (!db) {
			return undefined;
		}

		const collection: Collection = db.collection(collectionName);
		if (!collection) {
			return undefined;
		}

		return collection;
	}
}
