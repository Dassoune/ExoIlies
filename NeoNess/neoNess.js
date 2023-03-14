const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
var $ = require('jquery')

//Constants
const PORT = 8080;
const HOST = "0.0.0.0";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));  

app.set("view engine", "ejs");
app.set("views", "./views");

let conHandler = mysql.createConnection(
    {
        host: "172.17.0.1",
        user: "dassoune",
        password: "noemie0205",
        database: "NeoNess"
    }
);

conHandler.connect(function(err) {
    if (err) throw err;
    console.log("La base NeoNess est connectée !");
});

app.get("/", (req, res) => {
    res.redirect("/index_NeoNess.html");
});

app.get("/public/index_NeoNess.html", (req, res) => {
    res.redirect("/index_NeoNess.html");
});

app.get("/user", function(req, res) {
    conHandler.connect(function(err) {
        if (err) throw err;
    conHandler.query(myquery, function(err, results, fields) {
        if (err) throw err;
        // console.log(results);
        res.render("user_NeoNess");
    })
    });
});

app.get('/opt',function(req,res){ 
    let myquery = "SELECT * FROM Activities " ;
    conHandler.connect(function(err) {
        if (err) throw err;
    conHandler.query(myquery, function(err, results, fields) {
        if (err) throw err;
        // console.log(results);
        res.send(results)
    })
    });
});

app.get("/connect", (req, res) => {
    let myquery = "SELECT * FROM Activities, Session"
    conHandler.connect(function(err) {
        if (err) throw err;
    conHandler.query(myquery, function(err, results) {
        if (err) throw err;
         console.log(results);
        // res.render(results)
        //res.render("testos", { 'title' : "récap session", 'display_results' : results});
    })
    });
});



app.post("/createUser", (req, res) =>{
    let username = req.body.username;
    let password = req.body.password;
    // let passConf = req.body.password_confirm;
    let nom = req.body.userReelName;
    let prenom = req.body.userLastName;
    let phone = req.body.phoneNumber;
    let age = req.body.age;
    let taille = req.body.taille;
    let poids = req.body.poids;
    let objectif = req.body.objectif;

let myquery = "INSERT INTO User (Username, Password, isAdmin, userRealName, userLastName, phoneNumber, userAge, userHeight, userWeight, userGoal ) VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?)";
conHandler.connect(function(err){
    if (err) throw err;
    conHandler.query(myquery, [username, password, nom, prenom, phone, age, taille, poids, objectif], function(err, result){
        if (err) throw err;
        res.render("user_NeoNess")
    });
});
});

app.post('/connect', (req, res) => {
    // console.log(req.body);
    let username = req.body.usernameConnect
        let password = req.body.passwordConnect
        let myquery = "SELECT Username, isAdmin, idUser FROM User WHERE username = ? AND password = ? "
    conHandler.connect(function(err){
        if (err) throw err
    });
    conHandler.query( myquery,[username, password], function(err, results){
        console.log(results)
        if (err) throw err;
              
         if (results.length == 1){
            if (results[0].isAdmin === 0) {
                idUser = results[0].idUser
                console.log(idUser)
        res.render("user_NeoNess", {'idUser': idUser })
        
    } else {
        res.render("admin_NeoNess", {'title' : 'Index', 'message': `Bienvenue ${username}`})
        }
    }
     else if (results.length > 1){
        // res.redirect("/index_NeoNess.html");
        res.send("Erreur dans la BDD");
    } else {
        // res.redirect("/index_NeoNess.html");
        res.send("Mauvaise combinaison Utilisateur / mot de passe");
    }
});
    // res.render("loginPage", { 'title' : "liste complète"});
}); // end of app.get / 

app.post('/createdaily',function(req,res){
    
    // faire la requete qui permet de créer l'élément 
    // console.log(req.body);
    let values = req.body ;
    // let tabname = req.body.table ;

    
        conHandler.connect(function (err) {
            if (err) throw err ;
            const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${year}-${month}-${day}`;
console.log(currentDate); // "17-6-2022"
            let userID = req.body.iduser
            let activite = req.body.activite ;
            let duree = req.body.dureeActivite ;
            let myquery = "INSERT INTO Session (activityID, userID, sessionLength, dateSession ) " ;
            myquery += "VALUES ('" + 
            activite + "' , '" + 
            userID + "' , '" +
            duree + "' , '" +
            currentDate + "' )" ;
            // console.log(myquery);
            // j'execute la requete 
            conHandler.query(myquery, function (err, results, fields) {
              if (err) throw err;
              // je verifie sur la console du serveur que j'ai bien qqchose ?
            //   console.log(results);
              // je retourne les resultats
              res.render("confirm", { 'title': "Session crée", 'element' : "Session crée avec succès"});
             });
          });
    
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);