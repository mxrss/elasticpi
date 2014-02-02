var http = require('http');
var port = process.env.port || 1337;
var qs = require("querystring");
var os=require('os');
var child_process = require("child_process");
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    var str = req.url.split('?')[1];
    var ip = qs.parse(str);

    var exec = child_process.exec;
    exec("sed -i 's/address .*/address " + ip.ip + "/'  /etc/network/interfaces", function(err, stdout, stderr) {
            if (err){
                    console.log('child process executed with error', err.code);
                    return;
                }
            console.log(stdout);
        });

        exec("sudo ifdown eth0 && sudo ifup eth0", function(err, stdout, stderr) {
            if (err){
                    console.log('child process executed with error', err);
                    return;
                }
            console.log(stdout);
        });

        
    
    var ifaces=os.networkInterfaces();
    var lines= "";
    lines += ip.ip + "\n";
    for (var dev in ifaces) {
      var alias=0;
      ifaces[dev].forEach(function(details){
        if (details.family=='IPv4' && details.internal == false) {
            console.log(details);
          lines += details.address;
          ++alias;
        }
      });

    

  
}

res.end(lines);
}).listen(port);