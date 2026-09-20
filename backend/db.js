const {Pool} = require('pg')
const pool=new Pool(
  {
    user:process.env.user,
    password:process.env.password,
    host:process.env.host,
    database:process.env.database,
    port:process.env.port,
  }
);
module.exports=pool;