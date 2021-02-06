package main

import (
	"github.com/gorilla/websocket"
)

type Player struct {
	Id		int				`json:"id"`
	X		int				`json:"x"`
	Y		int				`json:"y"`
	Z		int				`json:"z"`
	Entity	interface{}		`json:"entity"`
}

type PlayerUpdate struct {
	Id		int				`json:"id"`
	X		int				`json:"x"`
	Y		int				`json:"y"`
	Z		int				`json:"z"`
}

type PlayerData struct {
	Id		int				`json:"id"`
	Players	map[int]Player		`json:"players"`
}

var Players = make(map[int]Player)
var idIcr = 0

func initializePlayer(conn *websocket.Conn) {
	idIcr++
	player := Player{
		Id:     idIcr,
		X:      0,
		Y:      0,
		Z:      0,
		Entity: nil,
	}
	Players[player.Id] = player

	playerData := PlayerData {
		Id:      player.Id,
		Players: Players,
	}

	_ = broadcastData("playerJoined", player, conn)
	_ = sendData("playerData", playerData, conn)
}

func positionUpdate(conn *websocket.Conn, data PlayerUpdate) {
	Players[data.Id] = Player {
		Id:     Players[data.Id].Id,
		X:      data.X,
		Y:      data.Y,
		Z:      data.Z,
		Entity: Players[data.Id].Entity,
	}

	_ = broadcastData("playerMoved", data, conn)
}
