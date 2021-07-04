const express=require("express");
const http=require("http")
const app=express()
const server=http.createServer(app)
const io=require("socket.io")(server,{
cors:{
    origin:"*",
    methods:["GET","POST"]
}
})
const PORT=process.env.PORT || 5000;

io.on("connection",(socket)=>{
    socket.emit("me",socket.id);

    socket.on("disconnect",()=>{
        socket.broadcast.emit("callEnded");

    })
    
    socket.on("callUser",(data)=>{
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

app.get("/",(req,res)=>{
    res.send("server is running");
})

server.listen(PORT,()=>{
    console.log("app running")
})