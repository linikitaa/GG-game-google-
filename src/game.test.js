const { Game } = require('./game');

describe('game tests', () => {
    let game

    beforeEach(()=>{
        game = new Game()
    })

    afterEach(async ()=>{
        await game.stop()
    })

    it('init test', () => {

        game.settings = ({
            gridSize: {
                columns: 4,
                rows: 5,
            }
        })

        // const settings = game.getSettings()

        expect(game.settings.gridSize.columns).toBe(4)
        expect(game.settings.gridSize.rows).toBe(5)
    });
    it('start game', async () => {
        game.settings = ({
            gridSize: {
                columns: 1,
                rows: 3,
            }
        })
        expect(game.status).toBe('pending')
        await game.start()

        expect(game.status).toBe('in-process')
    });
    it('check players start position', async () => {
        for (let i = 0; i< 10;i++) {

            game.settings = ({
                gridSize: {
                    columns: 1,
                    rows: 3,
                }
            })

            await game.start()

            // console.log('game.player1',game.player1)
            // console.log('game.player2',game.player2)
            // console.log('game.google',game.google)
            // console.log('----------------------------')

            expect([1]).toContain(game.player1.position.x)
            expect([1, 2, 3]).toContain(game.player1.position.y)

            expect([1]).toContain(game.player2.position.x)
            expect([1, 2, 3]).toContain(game.player2.position.y)

            expect((game.player1.position.x !== game.player2.position.x !== game.google.position.x) ||
                (game.player1.position.y !== game.player2.position.y !== game.google.position.y))
                .toBe(true)


        }
    });
    it('check google position after jump', async () => {

        game.settings = ({
            gridSize: {
                columns: 1,
                rows: 4,
            },
            googleJumpInterval: 100
        })

        await game.start()

        const prevPosition = game.google.position.clone()
        console.log(game.google.position)

        await sleep(150)

        console.log(game.google.position)

        // expect(game.google.position).not.toEqual(prevPosition)
        expect(game.google.position.equal(prevPosition)).toBe(false)
    });
});

function sleep(delay) {
    return new Promise((resolve)=>{
        setTimeout(resolve, delay)
    })
}