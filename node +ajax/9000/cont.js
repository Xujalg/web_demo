const fs = require('fs')
const formidable = require('formidable');


module.exports = {
    all(res) {

        fs.readFile('./db.json', 'utf8', (err, jsondata) => {
            // console.log('123')

            res.end(jsondata)
        })
    },
    del(id, res) {
        fs.readFile('./db.json', 'utf8', (err, jsondata) => {
            // console.log(jsondata)
            var arrjson = JSON.parse(jsondata)

            for (let i = 0; i < arrjson.length; i++) {
                if (arrjson[i].id == id) {
                    arrjson.splice(i, 1);
                }
            }
            fs.writeFile('./db.json', JSON.stringify(arrjson), (err) => {
                if (!err) {

                    res.end('1')
                }
            })
        })
    },
    getone(res) {
        fs.readFile('./db.json', 'utf8', (err, jsondata) => {
            // console.log(jsondata)
            res.end(jsondata)
            // console.log(jsondata)


        })
    },
    replace(req, res) {
        var form = new formidable.IncomingForm();
        form.uploadDir = './temo'
        form.parse(req, (err, fields, files) => {
            if (!err) {
                fs.readFile('./db.json', 'utf-8', (err, data) => {
                    if (!err) {
                        var arrjson = JSON.parse(data);
                        // console.log('wwwww')
                        // console.log(fields)
                        for (var i = 0; i < arrjson.length; i++) {
                            if (fields.id == arrjson[i].id) {
                                // console.log(fields)
                                arrjson[i].id = fields.id;
                                arrjson[i].name = fields.name;
                                arrjson[i].nengli = fields.nengli;
                                arrjson[i].jituan = fields.jituan;
                                if (files.img.name != '') {
                                    arrjson[i].img = files.img.name;
                                    fs.rename(files.img.path, './img/' + files.img.name, err => 0)
                                }
                               

                                fs.writeFile('./db.json', JSON.stringify(arrjson),(err)=>{});
                                res.end('<script>location.href="/"</script>');
                            }
                        }
                        // res.end('1223211')
                    }
                })
            }
        })
    },
    adda(req,res){
        // console.log('123')
        var form = new formidable.IncomingForm();
        form.uploadDir = './temo'
        form.parse(req, (err, fields, files) => {
            if (!err) {
               fs.readFile('./db.json','utf8',(err,data)=>{
                   if(!err){
                       var jsondata=JSON.parse(data);
                    //    console.log(jsondata[jsondata.length-1].id)
             
                       fields.id=jsondata.length+1;
                       fields.img=files.img.name;
                       jsondata.push(fields);
                       fs.rename(files.img.path, './img/' + files.img.name,()=>{});
                       fs.writeFile('./db.json',JSON.stringify(jsondata),()=>{})
                    //    console.log('qweqqqw')
                       res.end('1')
                   }
               })
            }

        })

    }
   

















}