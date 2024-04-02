const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json())

const connectionsDetails = {
     host: "localhost",
     database: "chatapp",
     user: "root",
     password: "manager"
};

app.get("/allContacts", (req, res) => {
     const connection = mysql.createConnection(connectionsDetails);
     connection.query("SELECT * FROM CONTACTS", (error, result) => {
          res.setHeader("Content-Type", "application/json");
          error == null ?
               res.write(JSON.stringify(result))
               :
               res.write(JSON.stringify(error));
          connection.end();
          res.end();
     });
});

app.get("/allMyMessages/:to/:me", (req, res) => {
     const connection = mysql.createConnection(connectionsDetails);
     const me = req.params.to;
     const to = req.params.me;
     var query = `select distinct a.idmsg, a.msgtext, b.me, b.to from message a, message b where a.me = ${me} and a.to = ${to} or b.me = ${to} and b.to = ${me} order by a.idmsg`;
     connection.query(query, (error, result) => {
          res.setHeader("Content-Type", "application/json");
          error == null ?
               res.write(JSON.stringify(result))
               :
               res.write(JSON.stringify(error));
          connection.end();
          res.end();
     })
});

app.post("/sendMessage", (req, res) => {
     // console.log(req.body);
     const connection = mysql.createConnection(connectionsDetails);
     const me = req.body.from;
     const to = req.body.to;
     const msg = req.body.msg;
     console.log(`from ${me} to ${to} : msg is ${msg}`);
     connection.query(`INSERT INTO MESSAGE VALUES(0,'${msg}', ${me}, ${to}, NOW());`, (error, result) => {
          res.setHeader("Content-Type", "application/json");
          error == null ?
               res.write(JSON.stringify(result))
               :
               res.write(JSON.stringify(error));
          connection.end();
          res.end();
     })
});

app.post("/addContact", (req, res) => {
     const connection = mysql.createConnection(connectionsDetails);
     const fname = req.body.fname;
     const lname = req.body.lname;
     const mobile = parseInt(req.body.mobile);
     var profilepic = req.body.profilepic;
     if(profilepic == null) profilepic = "https://static.thenounproject.com/png/2138343-200.png";
     var query = `INSERT INTO CONTACTS VALUES(0, '${fname}', '${lname}', ${mobile} ,'${profilepic}');`;
     connection.query(query, (error, result) => {
          res.setHeader("Content-Type", "application/json");
          error == null ?
               res.write(JSON.stringify(result))
               :
               res.write(JSON.stringify(error));
          connection.end();
          res.end();
     })
})

app.put("/changeProfilePic/:id", (req, res) => {
     const connection = mysql.createConnection(connectionsDetails);
     const id = parseInt(req.params.id);
     const profilepic = req.body.profilepic;
     var query = `UPDATE CONTACTS SET PROFILEPIC = '${profilepic}' WHERE ID = ${id};`;

     connection.query(query, (error, result) => {
          res.setHeader("Content-Type", "application/json");
          error == null ?
               res.write(JSON.stringify(result))
               :
               res.write(JSON.stringify(error));
          connection.end();
          res.end();
     })
})

app.put("/changeUserDetails/:id", (req, res) => {
     const connection = mysql.createConnection(connectionsDetails);
     const id = parseInt(req.params.id);
     const fname = req.body.fname;
     const lname = req.body.lname;
     var query = "";
     if (fname == null && lname == null) {
          connection.end();
          res.send("Nothing to change");
     } else if (fname == null) {
          query = `UPDATE CONTACTS SET LNAME = '${lname}' WHERE ID = ${id};`;
     } else if (lname == null) {
          query = `UPDATE CONTACTS SET FNAME = '${fname}'  WHERE ID = ${id};`;
     } else {
          query = `UPDATE CONTACTS SET LNAME = '${lname}', FNAME = '${fname}'  WHERE ID = ${id};`;
     }

     connection.query(query, (error, result) => {
          res.setHeader("Content-Type", "application/json");
          error == null ?
               res.write(JSON.stringify(result))
               :
               res.write(JSON.stringify(error));
          connection.end();
          res.end();
     })
})

app.delete("/deleteMessage/:msgId", (req, res) => {
     const connection = mysql.createConnection(connectionsDetails);
     const msgId = req.params.msgId;
     console.log(msgId);
     var query = `DELETE FROM MESSAGE WHERE IDMSG = ${msgId}`;
     connection.query(query, (error, result) => {
          res.setHeader("Content-Type", "application/json");
          error == null ?
               res.write(JSON.stringify(result))
               :
               res.write(JSON.stringify(error));
          connection.end();
          res.end();
     })
});

app.delete("/deleteContact/:id", (req, res) => {
     const connection = mysql.createConnection(connectionsDetails);
     const id = req.params.id;
     var query = `DELETE FROM CONTACTS WHERE ID = ${id}`;
     connection.query(query, (error, result) => {
          res.setHeader("Content-Type", "application/json");
          error == null ?
               res.write(JSON.stringify(result))
               :
               res.write(JSON.stringify(error));
          connection.end();
          res.end();
     })
});

app.listen(9999, () => {
     console.log("server running at 9999");
});

