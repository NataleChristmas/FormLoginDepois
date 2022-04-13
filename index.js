const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const port = 3000;
var path = require('path');
const app = express();

//criptografia

const crypto = require('crypto')
const alg = 'aes-256-ctr'
const password = 'abcdabcd'

function crypt(password){
    const cipher = crypto.createCipher(alg, password)
    const crypted = cipher.update(text, 'utf8', 'hex')
    return crypted
}

function decrypt(password){
    const decipher = crypto.createDecipher(alg, password)
    const plain = cipher.update(password, 'hex', 'utf8')
    return plain
}

//criptografia

var email = "profGirafallen@hotmail.com"


app.use(session({secret:'counterstrike'}));
app.use(bodyParser.urlencoded({extended:true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname,'public')));
app.set('/views', path.join(__dirname, '/views'));


app.post('/',(req,res)=>{
    console.log(req.body.password == password)
    console.log(req.body.email == email)
    if(req.body.password == password && req.body.email == email){

        req.session.email = email;
        
        res.render('logado');
    }else{

    res.render('index');
    }
})

app.get('/',(req,res)=>{
    if(req.session.email){
        res.render('logado');
        console.log('o meu usuario logado é: '+req.session.email);
    }else{
    res.render('index');
    }
})


app.listen(port,()=>{
    console.log('server running');
})

