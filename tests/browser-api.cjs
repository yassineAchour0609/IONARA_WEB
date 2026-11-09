const { MongoMemoryServer } = require('../backend/node_modules/mongodb-memory-server');
const mongoose = require('../backend/node_modules/mongoose');
process.env.JWT_SECRET='isolated-browser-test-secret-at-least-32-characters';
process.env.CLIENT_URL='http://127.0.0.1:3100';
process.env.WHATSAPP_NUMBER='';
process.env.CONTACT_EMAIL='';
(async()=>{
  const mongo=await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await Promise.all([require('../backend/models/User').init(),require('../backend/models/Order').init()]);
  const server=require('../backend/app').listen(5101,'127.0.0.1');
  const close=async()=>{server.close();await mongoose.disconnect();await mongo.stop();process.exit(0);};
  process.on('SIGTERM',close);process.on('SIGINT',close);
})().catch(err=>{console.error(err);process.exit(1);});
