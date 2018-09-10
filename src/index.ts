import app from './App'

class Server {
    private port;

    constructor() {
        this.port = process.env.PORT || 3000;
        this.init();
    }

    private init(): void {
        app.listen(this.port, (err) => {
            if (err) {
                return console.log(err)
            }
            return console.log(`server is listening on ${this.port}`)
        });
    }
}

new Server();
