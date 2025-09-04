const dotenv = require("dotenv");
dotenv.config();
const app = require('./src/app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/services/ai.service");

const chatHistory = []

const httpServer = createServer(app);
const io = new Server(httpServer,{
  cors:{
    origin: "https://chatbot-frontend-kappa-ruby.vercel.app/",
  }
});

io.on("connection", (socket) => {
   console.log("a user connected");

   socket.on("disconnect",()=>{
    console.log("a user disconnected");
   })

   socket.on("ai-message", async (data)=>{
    chatHistory.push({
      role:"user",
      parts:[{text:data}]
    })

     const response = await generateResponse(chatHistory);

     chatHistory.push({
      role:"model",
      parts:[{text:response}]
     });
      socket.emit("ai-response", {response})
    })
});


httpServer.listen(3000, ()=> {
    console.log('Server is running on port 3000');
})