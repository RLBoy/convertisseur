var express = require('express');
var youtubedl = require('youtube-dl');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require('fs');

var app = express();

app.get('/converter', function(req, res) { 
    res.render('converter.ejs');
})

/* On ajoute un son */
.post('/converter/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.url != '' && req.body.name != '') {
        var url = req.body.url;
        var titre = req.body.name;
        console.log(url);
        console.log(titre);
        var video = youtubedl(url,
        // Optional arguments passed to youtube-dl.
        ['--format=18'],
        // Additional options can be given for calling `child_process.execFile()`.
        { cwd: __dirname });

        // Will be called when the download starts.
        var name;
        video.on('info', function(info) {

        name = info._filename;
        console.log(name);
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
        });


        var write = fs.createWriteStream("./musics/"+titre+".mp4");
        video.pipe(write);
        write.on('finish', ()=>{
            console.log("Le fichier à bien été copié");
        });
        
    }
    res.redirect('/converter');
})
/* On redirige vers le convertisseur si la page demandée n'est pas trouvée */
.use(function(req, res, next){
    res.redirect('/converter');
})

.listen(8080);