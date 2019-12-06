const http = require('http'), url = require('url'), fs = require('fs');
var server = http.createServer();
server.listen(8000, () => {
    console.log('http://127.0.0.1:8000')
})

server.on('request', (req, res) => {
    var method = req.method;
    var urls = url.parse(req.url, true);
    if (method == 'GET') {
        if (urls.pathname == '/') {
            res.end('index');
        }
        else if (urls.pathname == '/one') {
            // console.log(urls.pathname)
            fs.readFile('./one.html', (err, data) => {
                // console.log(data)
                res.end(data);
            })
        }
        else if (urls.pathname == '/change') {
            fs.readFile('./change.html', 'utf8', (err, data) => {
                if (!err) {
                    // console.log(data)
                    res.end(data);

                }
            })
        }
        else if (urls.pathname == '/add') {
            fs.readFile('./add.html', 'utf8', (err, data) => {
                if (!err) {
                    res.end(data)
                }
            })
        }

        else {
            // console.log('1234')
            fs.readFile('.' + urls.pathname, (err, data) => {
                // console.log('1234')
                res.end(data);
            })
        }
    }
})