package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"sync"
)

type Player struct {
	Id     int         `json:"id"`
	X      float64     `json:"x"`
	Y      float64     `json:"y"`
	Z      float64     `json:"z"`
	Entity interface{} `json:"entity"`
}

type PlayerUpdate struct {
	Id int     `json:"id"`
	X  float64 `json:"x"`
	Y  float64 `json:"y"`
	Z  float64 `json:"z"`
}

type PlayerData struct {
	Id      int            `json:"id"`
	Players map[int]Player `json:"players"`
}

var playerMapMutex = sync.RWMutex{}
var Players = make(map[int]Player)
var idIcr = 0

func initializePlayer(conn *websocket.Conn) int {
	player := Player{
		Id:     idIcr,
		X:      0,
		Y:      0,
		Z:      0,
		Entity: nil,
	}

	playerMapMutex.RLock()
	Players[player.Id] = player
	playerMapMutex.RUnlock()

	fmt.Println(Players)

	idIcr++

	playerData := PlayerData{
		Id:      player.Id,
		Players: Players,
	}

	_ = broadcastData("playerJoined", player, conn)
	_ = sendData("playerData", playerData, conn)
	return player.Id
}

func positionUpdate(conn *websocket.Conn, data PlayerUpdate) {
	Players[data.Id] = Player{
		Id:     Players[data.Id].Id,
		X:      data.X,
		Y:      data.Y,
		Z:      data.Z,
		Entity: Players[data.Id].Entity,
	}

	_ = broadcastData("playerMoved", data, conn)
}
