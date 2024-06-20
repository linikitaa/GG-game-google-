class Game {
    #settings = {
        gridSize: {
            columns: 4,
            rows: 4,
        },
        googleJumpInterval: 2000
    }
    #status = 'pending'
    #player1
    #player2
    #google
    #googleSetIntervalId

    constructor() {
    }

    #getRandomPosition(coordinates) {
        let newX, newY
        do {
            newX = NumberUtils.getRandomNumber(this.#settings.gridSize.columns)
            newY = NumberUtils.getRandomNumber(this.#settings.gridSize.rows)
        }
        while (coordinates.some(el => el.x === newX && el.y === newY))
        return new Position(newX, newY)
    }

    #createUnits() {
        // const player1Position = new Position(
        //     NumberUtils.getRandomNumber(this.#settings.gridSize.columns),
        //     NumberUtils.getRandomNumber(this.#settings.gridSize.rows))
        const player1Position = this.#getRandomPosition([])
        this.#player1 = new Player(1, player1Position)

        const player2Position = this.#getRandomPosition([player1Position])
        this.#player2 = new Player(2, player2Position)

        // const googlePosition = this.#getRandomPosition([player1Position, player2Position])
        // this.#google = new Google(googlePosition)
        this.#moveGoogleToRandomPosition(true)
    }

    async start() {
        if (this.#status === 'pending') {
            this.#createUnits()
            this.#status = 'in-process'

            this.#runGoogleJumpInterval()
        }
    }

    #runGoogleJumpInterval() {
        this.#googleSetIntervalId = setInterval(()=>{
            this.#moveGoogleToRandomPosition()
        },this.#settings.googleJumpInterval)
    }

    async stop() {
        clearInterval(this.#googleSetIntervalId)
        this.#status = 'finished'
    }
    #moveGoogleToRandomPosition(excludeGoogle) {
        let notCrossedPosition = [this.#player1.position, this.#player2.position]

        if (!excludeGoogle) {
            notCrossedPosition.push(this.#google.position)
        }
        this.#google = new Google(this.#getRandomPosition(notCrossedPosition))
    }

    set settings(settings) {
        this.#settings = settings
    }

    get settings() {
        return this.#settings
    }

    get status() {
        return this.#status
    }

    get player1() {
        return this.#player1
    }

    get player2() {
        return this.#player2
    }

    get google() {
        return this.#google
    }
}

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    clone() {
        return new Position(this.x, this.y)
    }
    equal(otherPosition) {
        return otherPosition.x === this.x&& otherPosition.y === this.y
    }
}

class Unit {
    constructor(position) {
        this.position = position
    }
}

class Player extends Unit {
    constructor(id, position) {
        super(position)
        this.id = id
    }
}

class Google extends Unit {
    constructor(position) {
        super(position);
    }
}

class NumberUtils {
    static getRandomNumber(max) {
        return Math.floor(Math.random() * max + 1)
    }
}

module.exports = {
    Game
};