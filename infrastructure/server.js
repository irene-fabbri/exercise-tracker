import { app } from './web/app.js';

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

// the listening part is separated so that i can test app.js