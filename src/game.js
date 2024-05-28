class Game {
    #settings;
    #status = "pending";
    #player1
    #player2

    #getRandomPosition(coordinates){
        let newX, newY

        do{
            newX = NumberUtils.getRandomNumber(this.#settings.gridSize.columns)
            newY = NumberUtils.getRandomNumber(this.#settings.gridSize.rows)
        }
        while (coordinates.some(el=> el.x === newX && el.y === newY))
        return new Position(newX, newY)
    }

    #createPlayers() {
        // const player1Position = new Position(
        //     NumberUtils.getRandomNumber(this.#settings.gridSize.columns),
        //     NumberUtils.getRandomNumber(this.#settings.gridSize.rows))
        const player1Position = this.#getRandomPosition([])
        this.#player1 = new Player(1,player1Position)

        const player2Position =  this.#getRandomPosition([player1Position])
        this.#player2 = new Player(2,player2Position)
    }
    async start() {
        if (this.#status === "pending") {
            this.#createPlayers()
            this.#status = "in-process";
            }
    }
    set settings(settings) {
        this.#settings = settings;
    }

    get settings() {
        return this.#settings;
    }
    get status() {
        return this.#status;
    }
    get player1() {
        return this.#player1
    }
    get player2() {
        return this.#player2
    }
}
class Position {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
}
class Player {
    constructor(id, position) {
        this.id = id
        this.position = position
    }
}
class NumberUtils {
    static getRandomNumber(max) {
        return Math.floor(Math.random() * max + 1)
    }
}

module.exports = { Game };
