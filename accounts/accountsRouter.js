const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

router.post("/", async (req, res, next) => {
	try {
		const payload = {
			name: req.body.name,
			budget: req.body.budget,
		};
		// return the payload as the response (first makes it so it grabs the first object in the array)
		const [id] = await db("accounts").insert(payload);
		res.json( await db("accounts").where("id", id).first() );
	} catch (err) {
		next(err);
	}
});

// router.get("/", async (req, res, next) => {
// 	try {
// 		res.json( await db("accounts").select() );
// 	} catch (err) {
// 		next(err);
// 	}
// });

router.get("/:id", async (req, res, next) => {
	try {
		// use where when need to grab identifier
		res.json( await db("accounts").where("id", req.params.id).first() );
	} catch (err) {
		next(err);
	}
});

router.get("/", async (req, res, next) => {
	try {
		const query = {
			limit: req.query.limit,
			sortby: req.query.sortby,
			sortdir: req.query.sortdir,
		}
		if (query.limit && query.sortby && query.sortdir) {
			res.json( await db("accounts").orderBy(query.sortby, query.sortdir).limit(query.limit).select() );
		} else if (query.sortby || query.sortdir) {
			res.json( await db("accounts").orderBy(query.sortby, query.sortdir).select() );
		} else if(query.limit) {
			res.json( await db("accounts").limit(query.limit).select() );
		} else if(query.sortby) {
			res.json( await db("accounts").orderBy(query.sortby, "ASC").select() );
		} else if(query.sortdir) {
			res.json( await db("accounts").orderBy("name", query.sortdir).select() );
		} else {
			res.json( await db("accounts").select() );
		}
	} catch (err) {
		next(err);
	}
});

router.put("/:id", async (req, res, next) => {
	try {
		const payload = {
			name: req.body.name,
			budget: req.body.budget,
		};
		await db("accounts").where("id", req.params.id).update(payload);
		res.json( await db("accounts").where("id", req.params.id).first() );
	} catch (err) {
		next(err);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		await db("accounts").where("id", req.params.id).del();
		res.json({ message: "Deleted account" });
	} catch (err) {
		next(err);
	}
});

module.exports = router;