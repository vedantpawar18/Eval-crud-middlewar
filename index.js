const express= require("express");
const fs= require("fs");
const app= express();
app.use(express.json());
const morgan= require("morgan");

// morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms'
//     ].join(' ')
//   })


const validator= (req, res, next)=>{
    let {id, title, content,author}= req.body;
    if (typeof(id)=="number" && typeof(content)=="string" && typeof(title)=="string" && typeof(author)=="string" )
    {
     next()
    }
    else{
     res.send("Validation Failed")
    }
     
 }

app.post("/posts/create", validator, (req,res)=>{
    const payload=(req.body)
    const data= fs.readFileSync("./posts.json", {encoding:"utf-8"})
    const parseData=JSON.parse(data);
     const posts= parseData.posts
    const Newproducts=[...posts, payload];
    parseData.posts=Newproducts;
    const latest_data= JSON.stringify(parseData)
    fs.writeFileSync("./posts.json", latest_data, "utf-8")
    // console.log(Newproducts)
    res.send("posts added")
})

app.get("/posts", (req,res)=>{
    const data=fs.readFileSync("./posts.json", {encoding:"utf-8"})
    const parsedData= JSON.parse(data)
    parsedData.posts.map((el)=>{
        res.write(JSON.stringify(el.id))
        res.write(JSON.stringify( el.title))
        res.write(JSON.stringify( el.author))
        res.write(JSON.stringify( el.content ))

    })
    res.send()
})

app.put("/posts/:id", (req,res)=>{
    const data=fs.readFileSync("./posts.json", {encoding:"utf-8"})
    const parsedData = JSON.parse(data)
    const posts= parsedData.posts
    var id = req.params["id"]
    
    const post= posts.find(item => ":"+item.id === id);
    console.log(id, post)
    const index = posts.indexOf(post);
    posts[index] = req.body;
    const latest_data= JSON.stringify(parsedData)
    fs.writeFileSync("./posts.json", latest_data, "utf-8")
    res.send("post updated")
})

app.delete("/posts/:id", (req,res)=>{
    const data=fs.readFileSync("./posts.json", {encoding:"utf-8"})
    const parsedData = JSON.parse(data)
    const posts= parsedData.posts
    const post= posts.find(item => ":"+item.id === req.body.id);
    const index = posts.indexOf(post);
    posts.splice(index, 1);
    const latest_data= JSON.stringify(parsedData)
    fs.writeFileSync("./posts.json", latest_data, "utf-8")
    res.send("product deleted")
})











app.listen(7000, ()=>{
    console.log("listening on port 7000")
})