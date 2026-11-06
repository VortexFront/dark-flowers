const {defineConfig}=require('@playwright/test');
const port=Number(process.env.PORT||19370);
module.exports=defineConfig({
  testDir:'./tests/browser',workers:1,retries:0,timeout:30000,
  use:{baseURL:`http://127.0.0.1:${port}`,launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{},screenshot:'only-on-failure',trace:'retain-on-failure'},
  webServer:{command:'node tests/server.cjs',url:`http://127.0.0.1:${port}`,reuseExistingServer:false,timeout:15000,env:{PORT:String(port)}},
  projects:[390,1440].map(width=>({name:`chromium-${width}`,use:{browserName:'chromium',viewport:{width,height:900}}})),
});
