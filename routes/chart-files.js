const express = require('express');
const router = express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
//const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/gridfstest');
const { mongoose } = require('../db/mongoose');
const conn = mongoose.connection;
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
const gfs = Grid(conn.db);

/**
 * GridFs Storage 
 */
// Radar Chart
var storageRadar = GridFsStorage({
    gfs: gfs,
    filename: (req, file, cb) => {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    },
    contentType: 'application/json',
    metadata: (req, file, cb) => {
        cb(null, {
            originalName: file.originalname,
            info: req.body
        });
    },
    root: 'radarDataFiles' //root name for collection to store files into
});

var storageRadarBaseline = GridFsStorage({
    gfs: gfs,
    filename: (req, file, cb) => {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    },
    contentType: 'application/json',
    metadata: (req, file, cb) => {
        cb(null, {
            originalName: file.originalname,
            info: req.body
        });
    },
    root: 'radarBaselineFiles' //root name for collection to store files into
});

//Bar Chart
var storageBar = GridFsStorage({
    gfs: gfs,
    filename: (req, file, cb) => {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    },
    contentType: 'application/json',
    metadata: (req, file, cb) => {
        cb(null, {
            originalName: file.originalname,
            info: req.body // eventId
        });
    },
    root: 'barDataFiles' //root name for collection to store files into
});

var storageBarBaseline = GridFsStorage({
    gfs: gfs,
    filename: (req, file, cb) => {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    },
    contentType: 'application/json',
    metadata: (req, file, cb) => {
        cb(null, {
            originalName: file.originalname,
            info: req.body // eventId
        });
    },
    root: 'barBaselineFiles' //root name for collection to store files into
});

const radarUpload = multer({ storage: storageRadar }).any();
const radarBaseline = multer({ storage: storageRadarBaseline }).any();
const barUpload = multer({ storage: storageBar }).any();
const barBaseline = multer({ storage: storageBarBaseline }).any();



/**
 * POST - Upload file
 */
router.post('/radar', (req, res) => {
    radarUpload(req, res, err => {
        if (err) {
            res.json({ status: false, message: err });
            return;
        }
        else if (req.files.length === 0) {
            res.json({ status: false, message: 'No file found' });
            return;
        }
        res.json({
            id: req.files[0].id,
            fileName: req.files[0].filename,
            metadata: req.files[0].metadata,
            state: 'success'
        });
    });
});


router.post('/bar', (req, res) => {
    barUpload(req, res, err => {
        if (err) {
            res.json({ status: false, errDesc: err });
            return;
        }
        else if (req.files.length === 0) {
            res.json({ status: false, message: 'No file found' });
            return;
        }
        res.json({
            id: req.files[0].id,
            fileName: req.files[0].filename,
            metadata: req.files[0].metadata,
            state: 'success'
        });
    });
});


router.post('/radarBaseline', (req, res) => {
    radarBaseline(req, res, err => {
        if (err) {
            res.json({ status: false, message: err });
            return;
        }
        else if (req.files.length === 0) {
            res.json({ status: false, message: 'No file found' });
            return;
        }
        res.json({
            id: req.files[0].id,
            fileName: req.files[0].filename,
            metadata: req.files[0].metadata,
            state: 'success'
        });
    });
});


router.post('/barBaseline', (req, res) => {
    barBaseline(req, res, err => {
        if (err) {
            res.json({ status: false, errDesc: err });
            return;
        }
        else if (req.files.length === 0) {
            res.json({ status: false, message: 'No file found' });
            return;
        }
        res.json({
            id: req.files[0].id,
            fileName: req.files[0].filename,
            metadata: req.files[0].metadata,
            state: 'success'
        });
    });
});


/**
 * GET - Get file
 */
router.get('/radar/:id', (req, res) => {
    gfs.collection('radarDataFiles'); //set collection name to lookup into

    let id = mongoose.Types.ObjectId(req.params.id);
    gfs.files.find({ _id: id }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                status: false,
                responseMessage: "error"
            });
        }
        /** create read stream */
        let readstream = gfs.createReadStream({
            _id: files[0]._id,
            root: "radarDataFiles"
        });
        return readstream.pipe(res);
    });
});

router.get('/radar', (req, res) => {
    gfs.collection('radarDataFiles');

    gfs.files.find({
        'metadata.info.locationId': req.query.locationId,
        'metadata.info.eventId': req.query.eventId,
        'metadata.info.playerId': req.query.playerId
    }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.json({
                status: false,
                message: 'ERROR'
            });
        }
        let readstream = gfs.createReadStream({
            _id: files[0]._id,
            root: 'radarDataFiles'
        });
        return readstream.pipe(res);
    });
});

router.get('/radarBaseline', (req, res) => {
    gfs.collection('radarBaselineFiles');

    gfs.files.find({
        'metadata.info.locationId': req.query.locationId
    }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'ERROR'
            });
        }
        let readstream = gfs.createReadStream({
            _id: files[0]._id,
            root: 'radarBaselineFiles'
        });
        return readstream.pipe(res);
    });
});

router.get('/bar', (req, res) => {
    gfs.collection('barDataFiles'); //set collection name to lookup into
    console.log('in bar', req.query);
    gfs.files.find({
        'metadata.info.locationId': req.query.locationId,
        'metadata.info.eventId': req.query.eventId
    }).toArray((err, file) => {
        console.log(err);
        if (!file || file.length === 0) {
            return res.status(400).json({
               error: err
            });
        }
        let readstream = gfs.createReadStream({
            _id: file[0]._id,
            root: 'barDataFiles'
        });
        return readstream.pipe(res);
    });
});


router.get('/barBaseline', (req, res) => {
    gfs.collection('barBaselineFiles'); //set collection name to lookup into

    gfs.files.find({
        'metadata.info.locationId': req.query.locationId
    }).toArray((err, file) => {
        if (!file) {
            return res(400).json({
                status: false,
                message: 'No file found.'
            });
        }
        let readstream = gfs.createReadStream({
            _id: file[0]._id,
            root: 'barBaselineFiles'
        });
        return readstream.pipe(res);
    });
});




/**
 * DELETE - Delete file
 */
router.delete('/radarBaseline', (req, res) => {
    gfs.collection('radarBaselineFiles');

    gfs.files.find({
        'metadata.info.locationId': req.query.locationId
    }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                state: 'failure',
                message: err
            });
        }

        let options = {
            _id: files[0]._id,
            root: "radarBaselineFiles"
        }
        gfs.remove(options, err => {
            if (err) return handleError(err);
            res.json({
                status: true
            });
        });

    });
});

router.delete('/barBaseline', (req, res) => {
    gfs.collection('barBaselineFiles');
    gfs.files.find({
        'metadata.info.locationId': req.query.locationId
    }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                state: 'failure',
                message: err
            });
        }

        let options = {
            _id: files[0]._id,
            root: "barBaselineFiles"
        }
        gfs.remove(options, err => {
            if (err) return handleError(err);
            res.json({
                status: true
            });
        });
    });
});

router.delete('/radar/:id', (req, res) => {
    gfs.collection('radarDataFiles');

    let id = mongoose.Types.ObjectId(req.params.id);
    gfs.files.find({ _id: id }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                state: fail,
                message: err
            });
        }
        let options = {
            _id: files[0]._id,
            root: "radarDataFiles"
        }
        gfs.remove(options, err => {
            if (err) return handleError(err);
            res.json({
                status: true
            });
        });

    });
});

router.delete('/bar/:id', (req, res) => {
    gfs.collection('barDataFiles');
    let id = mongoose.Types.ObjectId(req.params.id);
    gfs.files.find({ _id: id }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                state: 'failure',
                message: err
            });
        }

        let options = {
            _id: files[0]._id,
            root: "barDataFiles"
        }
        gfs.remove(options, err => {
            if (err) return handleError(err);
            res.json({
                status: true
            });
        });
    });
});

module.exports = router;