const http = require("http");
const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "users.json");


if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}


const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};


const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};


const server = http.createServer((req, res) => {
  const { url, method } = req;

 
  if (url === "/users" && method === "GET") {
    const users = readUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  }


  else if (url === "/users" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const newUser = JSON.parse(body);
        if (!newUser.name || !newUser.id) {
          throw new Error("User must have an ID and Name.");
        }
        const users = readUsers();
        users.push(newUser);
        writeUsers(users);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User added successfully!" }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }


  else if (url.startsWith("/users/") && method === "DELETE") {
    const userId = url.split("/")[2];
    let users = readUsers();
    const initialLength = users.length;
    users = users.filter((user) => user.id !== userId);

    if (users.length === initialLength) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
    } else {
      writeUsers(users);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User deleted successfully" }));
    }
  }


  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});


const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
