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

router.get('/:id', validateSession, (req, res) => {
	const whereUserAndIdMatches = {
		where: { id: req.params.id, owner_id: req.user.id },
	};

	Log.findAll(whereUserAndIdMatches)
		.then(function findSuccess(log) {
			if (log.length > 0) {
				Log.findAll(whereUserAndIdMatches).then((log) =>
					res.status(200).json(log)
				);
			} else {
				res.status(500).json({ error: err });
			}
		})
		.catch((err) =>
			res.status(404).json({ error: 'You do not own any logs with that ID.' })
		);
});

router.put('/:id', validateSession, function (req, res) {
	const updatelogEntry = {
		description: req.body.description,
		definition: req.body.definition,
		result: req.body.result,
	};
	const whereIdMatches = { where: { id: req.params.id } };
	const whereUserMatches = { where: { owner_id: req.user.id } };
	const whereUserAndIdMatches = {
		where: { id: req.params.id, owner_id: req.user.id },
	};
	Log.findOne(whereIdMatches)
		.then(function findLogSucess(log) {
			if (log) {
				Log.findOne(whereUserAndIdMatches).then(function findUserSuccess(
					match
				) {
					if (match) {
						Log.update(updatelogEntry, whereUserAndIdMatches)
							.then(() => res.status(200).json({ message: 'Entry updated.' }))
							.catch((err) => res.status(500).json({ error: err }));
					} else {
						Log.findAll(whereUserMatches).then((logs) => {
							res.status(401).json({
								error:
									"That log does not belong to you! Here's a list of logs that belong to you:",
								logs,
							});
						});
					}
				});
			} else {
				Log.findAll(whereUserMatches).then((logs) => {
					res.status(404).json({
						error:
							"That log does not exist! Here's a list of logs that belong to you:",
						logs,
					});
				});
			}
		})
		.catch((err) => res.status(500).json({ error: err }));
});
router.delete('/:id', validateSession, function (req, res) {
	const whereIdMatches = { where: { id: req.params.id } };
	const whereUserMatches = { where: { owner_id: req.user.id } };
	const whereUserAndIdMatches = {
		where: { id: req.params.id, owner_id: req.user.id },
	};
	Log.findOne(whereIdMatches)
		.then(function findLogSucess(log) {
			if (log) {
				Log.findOne(whereUserAndIdMatches).then(function findUserSuccess(
					match
				) {
					if (match) {
						Log.destroy(whereUserAndIdMatches)
							.then(() => {
								res.status(200).json({
									message: 'Successfully deleted the following log:',
									match,
								});
							})
							.catch((err) => res.status(500).json({ error: err }));
					} else {
						Log.findAll(whereUserMatches).then((logs) => {
							res.status(401).json({
								error:
									"That log does not belong to you! Here's a list of logs that belong to you:",
								logs,
							});
						});
					}
				});
			} else {
				Log.findAll(whereUserMatches).then((logs) => {
					res.status(404).json({
						error:
							"That log does not exist! Here's a list of logs that belong to you:",
						logs,
					});
				});
			}
		})
		.catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
