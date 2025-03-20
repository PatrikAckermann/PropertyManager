const { ObjectId } = require('mongodb');

class mongoService {
    constructor(d, dbName, colName) {
        this.db = d.mongo.db(dbName).collection(colName);
        this.d = d;
    }

    async getAll() {
        console.log("Getting all tenants");
        return await this.db.find().toArray();
    }

    async getOne(id) {
        console.log(`Getting tenant by id: ${id}`);
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid tenant id");
        }
        id = new ObjectId(id);
        return await this.db.findOne({ "_id": id });
    }

    async add(tenant) {
        console.log("Adding tenant");
        if (tenant._id === undefined) {
            tenant._id = new ObjectId();
        }
        await this.db.insertOne(tenant);
        return tenant;
    }

    async update(id, tenant) {
        console.log(`Updating tenant by id: ${id}`);
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid tenant id");
        }
        id = new ObjectId(id);
        await this.db.updateOne({ "_id": id }, { $set: tenant });
        return this.db.findOne({ "_id": id });
    }

    async delete(id) {
        console.log(`Deleting tenant by id: ${id}`);
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid tenant id");
        }
        id = new ObjectId(id);
        return await this.db.deleteOne({ "_id": id });
    }
}

module.exports = mongoService;