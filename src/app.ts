import { MongoClient } from "mongodb";

const uri = 'mongodb://127.0.0.1:27017';
const dbName = '__test__';
const collectionName = 'test';

(async()=>{
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const __test__ = client.db(dbName);
    
    await __test__.collection(collectionName).insertMany([
        { name: 'kuzunoha', status: 200 },
        { name: 'pontaro',  status: 230 },
        { name: 'daigoro',  status: 309 }
    ]);

    //const cursor = __test__.collection(collectionName).find({});
    /* 
    const cursor = __test__.collection(collectionName).find({
        //name: 'kuzunoha'
        //name: /ro$/
        status: 200
        //status: /2[0-9]./
    });
    */
    // https://stackoverflow.com/questions/54448983/mongodb-regex-query-to-number-fails
    const cursor = __test__.collection(collectionName).aggregate([
        {$addFields: {statusStr: {$toString: '$status'}}},
        {$match:{statusStr:/2[0-9]./}}
    ]);
    
    while(await cursor.hasNext()){
        const data = await cursor.next();
        console.log(data.name);
    };
    await __test__.collection(collectionName).drop();
    await client.close()
})();
