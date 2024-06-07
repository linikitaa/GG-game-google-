// class Game {
//     #settings = {
//         gridSize: {
//             columns: 4,
//             rows: 4
//         }
//     }
//     #status = 'pending'
//     #player1
//     #player2
//     #google
//
//     constructor() {
//
//     }
//
//     #getRandomPosition(coordinates) {
//         let newX
//         let newY
//
//         do {
//             newX = NumberUtil.getRandomNumber(0, this.#settings.gridSize.columns - 1)
//             newY = NumberUtil.getRandomNumber(0, this.#settings.gridSize.rows - 1)
//         }
//         while (
//             coordinates.some(el=> el.x === newX && el.y === newY)
//             )
//             // this.#player1.position.rows === newY && this.#player1.position.columns === newX)
//         return new Position(newX, newY)
//     }
//
//     set settings(settings) {
//         if (!settings.gridSize) {
//             throw new Error(('Incorrect settings'))
//         }
//
//         if (settings.gridSize.columns * settings.gridSize.rows < 3) {
//             throw new Error('Cells count should be 3 and more')
//         }
//         this.#settings = settings
//     }
//
//     get settings() {
//         return this.#settings
//     }
//
//     get status() {
//         return this.#status
//     }
//
//     #createPlayers() {
//         const player1Postions = new Position(
//             NumberUtil.getRandomNumber(0, this.#settings.gridSize.columns - 1),
//             NumberUtil.getRandomNumber(0, this.#settings.gridSize.rows - 1),
//         )
//         this.#player1 = new Player(player1Postions)
//
//         const player2Position = this.#getRandomPosition(player1Postions)
//         this.#player2 = new Player(player2Position)
//
//         const googlePosition = this.#getRandomPosition([player1Postions, player2Position])
//         this.#google = new Google(googlePosition)
//     }
//
//     async start() {
//         if (this.#status = 'pending') {
//
//             this.#createPlayers()
//
//             this.#status = 'in-progress'
//         }
//
//
//     }
//
//     get players() {
//         return [this.#player1, this.#player2]
//     }
//
//     get google() {
//         return [this.#google]
//     }
// }
//
// class NumberUtil {
//     /*
//     * @param min
//     * @param max
//     * "куегкты вернет рандомное число от min до max
//     * */
//     static getRandomNumber(min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min
//     }
// }
//
// class Position {
//     constructor(x,y) {
//         this.x = x
//         this.y = y
//     }
// }
//
// class Unit {
//     constructor(position) {
//         this.position = position
//     }
// }
//
// class Player extends Unit{
//     constructor(position) {
//         super(position)
//     }
// }
//
// class Google extends Unit{
//     constructor(position) {
//         super(position)
//     }
// }
//
// module.exports = {
//     Game
// }


class Game {
    #settings = {
        gridSize: {
            columns: 4,
            rows: 4,
        },
        googleJumpInterval: 2000
    }
    #status = "pending";
    #score = {
        1 : {points : 0},
        2 : {points : 0}
    }
    #player1
    #player2
    #google

    #getRandomPosition(coordinates = []) {
        let newX, newY

        do {
            newX = NumberUtils.getRandomNumber(this.#settings.gridSize.columns)
            newY = NumberUtils.getRandomNumber(this.#settings.gridSize.rows)
        }
        while (
            coordinates.some(p=> newX === p.x && newY === p.y))
        return new Position(newX, newY)
    }

    set settings(settings) {
        if (!settings.gridSize) {
            throw new Error('incorrect settings')
        }
        if (settings.gridSize.columns * settings.gridSize.rows < 3) {
            throw new Error('Cells count should be 3 and more')
        }
        this.#settings = settings;
    }

    #createPlayers() {

        const player1Position = new Position(
            NumberUtils.getRandomNumber(this.#settings.gridSize.columns),
            NumberUtils.getRandomNumber(this.#settings.gridSize.rows)
        )
        this.#player1 = new Player(player1Position,1)

        const player2Position = this.#getRandomPosition([player1Position])
        this.#player2 = new Player(player2Position,2)

        // const googlePosition = this.#getRandomPosition([player1Position, player2Position])
        this.#google = new Google()
        this.#moveGoogleToRandomPosition(true)
    }

    async start() {
        if (this.#status === "pending") {
            this.#createPlayers()
            this.#status = "in-progress";

            setInterval(() => {
                this.#moveGoogleToRandomPosition()
            }, this.#settings.googleJumpInterval)
        }
    }

    #moveGoogleToRandomPosition(excludeGoogle = false) {
        let coordinates = [
            this.#player1.position,
            this.#player2.position,
            this.#google.position
        ];
        if(!excludeGoogle) {
            coordinates.push(this.#google.position)
        }
        const googlePosition = this.#getRandomPosition(coordinates)
        this.#google.position = googlePosition
    }

    get settings() {
        return this.#settings;
    }

    get status() {
        return this.#status;
    }

    get players() {
        return [this.#player1, this.#player2]
    }

    get google() {
        return this.#google

    }

    get score() {
        return this.#score

    }



    #canMoveOrOutOfBorders(player, delta) {
        const newPosition = player.position.clone()
        if (delta.x) newPosition.x += delta.x
        if (delta.y) newPosition.y += delta.y

        if (newPosition.x < 0 || newPosition.x > this.#settings.gridSize.columns) return false
        if (newPosition.y < 0 || newPosition.y > this.#settings.gridSize.rows) return false
        return true
    }
    #canMoveOrOtherPlayerBlocking(movingPlayer, otherPlayer, delta) {
        const newPosition = movingPlayer.position.clone()
        if (delta.x) newPosition.x += delta.x
        if (delta.y) newPosition.y += delta.y

        if (otherPlayer.position.equal(newPosition)) return false
        return true
    }
    #checkGoogleCatching(player) {
        if (player.position.equal(this.#google.position)) {
            this.#score[player.number].points++
            this.#moveGoogleToRandomPosition()

        }
    }
#movePlayer(player, otherPlayer, delta) {
    const canMove = this.#canMoveOrOutOfBorders(player, delta)
    if (!canMove) return

    const canMoveOtherPlayer = this.#canMoveOrOtherPlayerBlocking(player, otherPlayer, delta)
    if (!canMoveOtherPlayer) return;

    if (delta.x) player.position.x += delta.x
    if (delta.y) player.position.y += delta.y

    this.#checkGoogleCatching(player)
}

    movePlayer1Up() {
        let delta = {x: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1Down() {
        let delta = {x: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1Right() {
        let delta = {x:1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }
    movePlayer1Left() {
        let delta = {x: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer2Right() {
        let delta = {x:1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Left() {
        let delta = {x: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    movePlayer2Up() {
        let delta = {x: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }
    movePlayer2Down() {
        let delta = {x: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)
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
        return otherPosition.x === this.x && otherPosition.y === this.y
    }
}

class Unit {
    constructor(position) {
        this.position = position
    }
}

class Player extends Unit {
    constructor(position, number) {
        super(position)
        this.number = number
    }
}

class Google extends Unit {
    constructor(position) {
        super(position)
    }
}

class NumberUtils {
    static getRandomNumber(max) {
        return Math.floor(Math.random() * max + 1)
    }
}

module.exports = {Game};
