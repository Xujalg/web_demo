const http=require('http'),url=require('url'),fs=require('fs'),cont=require('./cont')
var server=http.createServer();
server.listen(9000,()=>{
    console.log('http://127.0.0.1:9000')
})

server.on('request',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE')
    // res.setHeader ('Access-Control-Allow-Headers: X-PINGOTHER, Content-Type')
    var method=req.method;
    var urls=url.parse(req.url,true);
    // res.end('cont(res)')
        if(urls.pathname=='/'){
            res.end('13');
        }
        else if(urls.pathname=='/all'){
            // console.log('1233131')
            cont.all(res)
        }
        else if(urls.pathname=='/del'){
            var ids = urls.query.id;
            // console.log(ids)
            cont.del(ids,res)
        }
        else if(urls.pathname=='/getone'){   
            // console.log('123')         
            cont.getone(res)
            
        }
        else if(urls.pathname=='/replace'){
        // console.log('123')
        // console.log('req'+req)
           cont.replace(req, res);
        }
        else if(urls.pathname=='/add'){
            // console.log('123111')
            // console.log('req'+req)
               cont.adda(req, res);
            }
        else {
            
            fs.readFile('.' + urls.pathname, (err, data) => {
                // console.log(urls.pathname)
                
                res.end(data);
            })
        }



 




})