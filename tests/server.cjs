// Loopback-only static development/test server; it has no ordering API.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');
 const target=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
 const ext=path.extname(target);
 if(req.method!=='GET'||!target.startsWith(root+path.sep)||!types[ext]||path.relative(root,target).split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',types[ext]+'; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(fs.readFileSync(target));}catch{res.writeHead(404).end();}
});
server.listen(Number(process.env.PORT||19370),'127.0.0.1',()=>console.log('Dark Flowers static demo ready on loopback'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
