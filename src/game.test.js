const { Game } = require("./game");

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
    expect(game.status).toBe("in-process");
});

test('check players start positions', async ()=> {
    const game = new Game();

    game.settings = {
        gridSize: {
            columns: 1,
            rows: 3,
        },
    };

    await game.start()

    console.log('game PL1', game.player1.position)
    console.log('game PL2', game.player2.position)
    console.log('game google', game.google.position)

    expect([1]).toContain(game.player1.position.x)
    expect([1, 2, 3]).toContain(game.player1.position.y)

    expect([1]).toContain(game.player2.position.x)
    expect([1, 2, 3]).toContain(game.player2.position.y)

    expect([1]).toContain(game.google.position.x)
    expect([1, 2, 3]).toContain(game.google.position.y)

    expect((game.player1.position.x !== game.player2.position.x || game.player1.position.y !== game.player2.position.y)
        &&
        (game.player1.position.x !== game.google.position.x || game.player1.position.y !== game.google.position.y)
        &&
        (game.player2.position.x !== game.google.position.x || game.player2.position.y !== game.google.position.y)
           ).toBe(true)
})

test("check google position after jump", async () => {
    const game = new Game();

    game.settings = {
        gridSize: {
            columns: 4,
            rows: 5,
        },
    }

    await game.start();
    expect(game.status).toBe("in-process");
});
