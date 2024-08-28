import { MigrationInterface } from 'mongo-migrate-ts';
import { Db } from 'mongodb';


export class Migration1724854893943 implements MigrationInterface {
    public async up(db: Db): Promise<void | never> {
        const bloqCollection = db.collection('Bloq');
        const lockerCollection = db.collection('Locker');
        const rentCollection = db.collection('Rent');

        // Insert Bloqs
        await bloqCollection.insertMany(bloqs);

        // Insert Lockers
        await lockerCollection.insertMany(lockers);

        // Insert Rents
        await rentCollection.insertMany(rents);
    }

    public async down(db: Db): Promise<void | never> {
        const bloqCollection = db.collection('Bloq');
        const lockerCollection = db.collection('Locker');
        const rentCollection = db.collection('Rent');

        await bloqCollection.deleteMany({});
        await lockerCollection.deleteMany({});
        await rentCollection.deleteMany({});
    }
}


const bloqs = [
    {
        "id": "c3ee858c-f3d8-45a3-803d-e080649bbb6f",
        "title": "Luitton Vouis Champs Elysées",
        "address": "101 Av. des Champs-Élysées, 75008 Paris, France"
    },
    {
        "id": "484e01be-1570-4ac1-a2a9-02aad3acc54e",
        "title": "Riod Eixample",
        "address": "Pg. de Gràcia, 74, L'Eixample, 08008 Barcelona, Spain"
    },
    {
        "id": "22ffa3c5-3a3d-4f71-81f1-cac18ffbc510",
        "title": "Bluberry Regent Street",
        "address": "121 Regent St, Mayfair, London W1B 4TB, United Kingdom"
    }
]

const lockers = [
    {
        "id": "1b8d1e89-2514-4d91-b813-044bf0ce8d20",
        "bloqId": "c3ee858c-f3d8-45a3-803d-e080649bbb6f",
        "status": "CLOSED",
        "isOccupied": true
    },
    {
        "id": "8b4b59ae-8de5-4322-a426-79c29315a9f1",
        "bloqId": "c3ee858c-f3d8-45a3-803d-e080649bbb6f",
        "status": "OPEN",
        "isOccupied": false
    },
    {
        "id": "2191e1b5-99c7-45df-8302-998be394be48",
        "bloqId": "c3ee858c-f3d8-45a3-803d-e080649bbb6f",
        "status": "CLOSED",
        "isOccupied": true
    },
    {
        "id": "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
        "bloqId": "484e01be-1570-4ac1-a2a9-02aad3acc54e",
        "status": "CLOSED",
        "isOccupied": true
    },
    {
        "id": "ea6db2f6-2da7-42ed-9619-d40d718b7bec",
        "bloqId": "484e01be-1570-4ac1-a2a9-02aad3acc54e",
        "status": "CLOSED",
        "isOccupied": false
    },
    {
        "id": "3c881050-54bb-48bb-9d2c-f221d10f876b",
        "bloqId": "484e01be-1570-4ac1-a2a9-02aad3acc54e",
        "status": "OPEN",
        "isOccupied": false
    },
    {
        "id": "3139e8ce-ff98-4cb4-9e00-7f9d8b20e732",
        "bloqId": "22ffa3c5-3a3d-4f71-81f1-cac18ffbc510",
        "status": "OPEN",
        "isOccupied": false
    },
    {
        "id": "75f03ea9-c825-4e76-9484-f8b7f0a1d125",
        "bloqId": "22ffa3c5-3a3d-4f71-81f1-cac18ffbc510",
        "status": "OPEN",
        "isOccupied": false
    },
    {
        "id": "c4705b02-45be-4fd7-8d82-d336df1fa493",
        "bloqId": "22ffa3c5-3a3d-4f71-81f1-cac18ffbc510",
        "status": "CLOSED",
        "isOccupied": false
    }
]

const rents = [
    {
        "id": "50be06a8-1dec-4b18-a23c-e98588207752",
        "lockerId": null,
        "weight": 5,
        "size": "M",
        "status": "CREATED"
    },
    {
        "id": "40efc6fd-f10c-4561-88bf-be916613377c",
        "lockerId": "1b8d1e89-2514-4d91-b813-044bf0ce8d20",
        "weight": 7,
        "size": "L",
        "status": "WAITING_PICKUP"
    },
    {
        "id": "84ba232e-ce23-4d8f-ae26-68616600df48",
        "lockerId": "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
        "weight": 10,
        "size": "XL",
        "status": "WAITING_DROPOFF"
    },
    {
        "id": "feb72a9a-258d-49c9-92de-f90b1f11984d",
        "lockerId": "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
        "weight": 30,
        "size": "XL",
        "status": "DELIVERED"
    }
]