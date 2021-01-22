const router = require('express').Router();
let validateSession = require('../middleware/validate-session');
const Log = require('../db').import('../models/log');

router.post('/', validateSession, function (req, res) {
	const logEntry = {
		description: req.body.description,
		definition: req.body.definition,
		result: req.body.result,
		owner_id: req.user.id,
	};
	Log.create(logEntry)
		.then((log) => res.status(200).json(log))
		.catch((err) => res.status(500).json({ error: err }));
});
router.get('/', validateSession, (req, res) => {
	Log.findAll({
		where: { owner_id: req.user.id },
	})
		.then((logs) => res.status(200).json(logs))
		.catch((err) => res.status(500).json({ error: err }));
});

router.get('/:id', (req, res) => {
	Log.findAll({
		where: { id: req.params.id },
	})
		.then((logs) => res.status(200).json(logs))
		.catch((err) => res.status(500).json({ error: err }));
});
router.put('/:id', validateSession, function (req, res) {
	const updatelogEntry = {
		description: req.body.description,
		definition: req.body.definition,
		result: req.body.result,
	};

	const query = { where: { id: req.params.id, owner_id: req.user.id } };

	Log.update(updatelogEntry, query)
		.then(() => res.status(200).json({ message: 'Entry updated.' }))
		.catch((err) => res.status(500).json({ error: err }));
});

router.delete('/:id', validateSession, function (req, res) {
	const query = {
		where: {
			id: req.params.id,
			owner_id: req.user.id,
		},
	};
	Log.destroy(query)
		.then(() => res.status(200).json({ message: 'Entry removed' }))
		.catch((err) => res.status(500).json({ error: err }));
});
module.exports = router;
