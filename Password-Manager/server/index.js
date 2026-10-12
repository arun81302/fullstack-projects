import e from "express"
import mysql from 'mysql2';
import cors from 'cors'
const app=e()
app.use(cors())
app.use(e.json())

const db=mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'1234',
    database:'password_manager'
})


const PORT=3000


app.post('/addpassword',(req,res)=>{
    const {password,title}=req.body

    db.query("INSERT INTO passwords (Password,apps) VALUES (?,?)",[password,title],(err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).send('Database error');
        } else{
            res.send("success")
        }
    })
})

app.get("/showpasswords", (req, res) => {
  const sql = "SELECT * FROM passwords";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Fetch error:", err.message);
      return res.status(500).send("Database error");
    }

    res.json(result);
    console.log(result)
  });
});

app.listen(PORT,()=>{
    console.log('port is running')
})