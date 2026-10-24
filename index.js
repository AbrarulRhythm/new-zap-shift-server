import express from 'express';
import cors from 'cors';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from 'mongodb';

const port = process.env.PORT || 3000;

// Middleeare
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
    console.log(`⚡ ${req.method} - ${req.path} from ${req.host} at ⌛ ${new Date().toLocaleString()}`);
    next();
});

const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrthjko.mongodb.net/`);

async function connectToMongoDB() {
    try {
        await client.connect();

        // Database
        const db = client.db('new_zap_shift_db');

        // Collections
        const parcelsCollection = db.collection('parcels');

        // :::::::::::::::::::::::::::::: - Parcel Related APIS - ::::::::::::::::::::::::::::::
        // Get api
        app.get('/', async (req, res) => {
            try {
            } catch (error) {}
        });

        // Post api
        app.post('/parcels', async (req, res) => {
            try {
                const parcel = req.body;
                parcel.createdAt = new Date();

                const result = await parcelsCollection.insertOne(parcel);

                if (!result.acknowledged || !result.insertedId) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to insert parcel into the database.',
                    });
                }

                // Success
                return res.status(201).json({
                    success: true,
                    message: 'Success! Your parcel has been created.',
                    data: {
                        insertedId: result.insertedId,
                        acknowledged: result.acknowledged,
                    },
                });
            } catch (error) {
                console.error('Error saving parcel:', error);
                res.status(500).send({ message: 'Internal Server Error', error: error.message });
            }
        });

        console.log('You successfully connected to MongoDB!');
        return client;
    } catch (err) {
        console.dir(err);
    }
}
connectToMongoDB().catch(console.dir);

// Basic routes
app.get('/', (req, res) => {
    res.send({ status: 'ok', message: 'Zap Shift Server' });
});

// 404
app.all(/.*/, (req, res) => {
    res.status(404).json({
        status: 404,
        error: 'API not found',
    });
});

app.listen(port, () => {
    console.log(`Zap Shift server is running on port: ${port}`);
});
