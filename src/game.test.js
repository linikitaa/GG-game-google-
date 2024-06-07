const {Game} = require("./game");

test("init test", () => {
    const game = new Game();

    game.settings = {
        gridSize: {
            columns: 4,
            rows: 5,
        },
    };

    // const settings = game.getSettings()
    expect(game.settings.gridSize.columns).toBe(4);
    expect(game.settings.gridSize.rows).toBe(5);
});
test("start game", async () => {
    const game = new Game();

    game.settings = {
        gridSize: {
            columns: 4,
            rows: 5,
        },
    }

    expect(game.status).toBe("pending");
    await game.start();
    expect(game.status).toBe("in-progress");
});
test('check players start positions', async () => {
    for (let i = 0; i < 10; i++) {
        const game = new Game();

        game.settings = {
            gridSize: {
                columns: 1,
                rows: 3,
            },
        };


        await game.start()

        expect([1]).toContain(game.players[0].position.x);
        expect([1, 2, 3]).toContain(game.players[0].position.y);

        expect([1]).toContain(game.players[1].position.x);
        expect([1, 2, 3]).toContain(game.players[1].position.y);

        expect(
            game.players[0].position.columns !== game.players[1].position.x ||
            game.players[0].position.rows !== game.players[1].position.y
        ).toBe(true)


    }
})
test('check google init position', async () => {
    for (let i = 0; i < 10; i++) {
        const game = new Game();
        game.settings = {
            gridSize: {
                columns: 1,
                rows: 3,
            },
        };
        await game.start();

        expect([1]).toContain(game.google.position.x);
        expect([1, 2,3]).toContain(game.google.position.y);

        expect(
            (
                game.google.position.x !== game.players[0].position.x ||
                game.google.position.y !== game.players[0].position.y
            )
            &&
            (
                game.google.position.x !== game.players[1].position.x ||
                game.google.position.y !== game.players[1].position.y
            )
        ).toBe(true)
    }
})
test('check google position after jump', async () => {
    const game = new Game();
    game.settings = {
        gridSize: {
            columns: 1,
            rows: 4,
            googleJumpInterval: 100
        },
    };


    await game.start();

    const prevPositions = game.google.position.clone()

    await sleep(150)

    expect(game.google.position.equal(prevPositions)).toBe(false);
    // expect(game.google.position.y).toBe(false);
})
function sleep(ms) {
    return new Promise((resolve)=>{
        setTimeout(resolve, ms)
    })
}
test('catch google by player1 or player2', async () => {
    const game = new Game();
    game.settings = {
        gridSize: {
            columns: 3,
            rows: 1,
        },
    };

    await game.start();
    // p1 p2 g / p1 g p2 / p2 p1 g / g p1 p2 / g p2 p1

    const prevGooglePosition = game.google.position.clone()

    const deltaForPlayer1 = game.google.position.x - game.players[0].position.x
    // if (delta === 2 || delta === -2)
    if (Math.abs(deltaForPlayer1) === 2) {
        const deltaForPlayer2 = game.google.position.x - game.players[1].position.x
        if (deltaForPlayer2 > 0) game.movePlayer2Right()
        else game.movePlayer2Left()

        expect(game.score[1].points).toBe(0)
        expect(game.score[2].points).toBe(1)
    } else {
         if (deltaForPlayer1 > 0) game.movePlayer1Right()
         else game.movePlayer1Left()

        expect(game.score[1].points).toBe(1)
        expect(game.score[1].points).toBe(0)
    }

    expect(game.google.position.equal(prevGooglePosition)).toBe(false);
    // expect(game.google.position.y).toBe(false);
})