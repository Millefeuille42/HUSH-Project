package main

import (
	"github.com/gorilla/websocket"
	"sync"
)

type Player struct {
	Id     int         `json:"id"`
	X      float64     `json:"x"`
	Y      float64     `json:"y"`
	Z      float64     `json:"z"`
	RotX   float64     `json:"rotx"`
	RotY   float64     `json:"roty"`
	RotZ   float64     `json:"rotz"`
	State	string		`json:"state"`
	Name	string		`json:"name"`
	Entity interface{} `json:"entity"`
}

type PlayerUpdate struct {
	Id		int     	`json:"id"`
	X  		float64 	`json:"x"`
	Y  		float64 	`json:"y"`
	Z  		float64 	`json:"z"`
	RotX	float64     `json:"rotx"`
	RotY	float64     `json:"roty"`
	RotZ	float64     `json:"rotz"`
	State	string		`json:"state"`
	Name	string		`json:"name"`
}

type PlayerData struct {
	Id      int            `json:"id"`
	Players map[int]Player `json:"players"`
}

var playerMapMutex = sync.RWMutex{}
var wsMutex = sync.RWMutex{}

var Players = make(map[int]Player)
var idIcr = 0

func initializePlayer(conn *websocket.Conn) int {
	player := Player {
		Id:     idIcr,
		X:      0,
		Y:      0,
		Z:      0,
		RotX:   0,
		RotY:   0,
		RotZ:   0,
		Entity: nil,
		State: "idle",
		Name:	"Player",
	}

	playerMapMutex.Lock()
	Players[player.Id] = player

	idIcr++

	playerData := PlayerData{
		Id:      player.Id,
		Players: Players,
	}
	playerMapMutex.Unlock()

	_ = broadcastData("playerJoined", player, conn)
	_ = sendData("playerData", playerData, conn)
	return player.Id
}

func positionUpdate(conn *websocket.Conn, data PlayerUpdate) {
	playerMapMutex.Lock()
	Players[data.Id] = Player{
		Id:			Players[data.Id].Id,
		X: 			data.X,
		Y: 			data.Y,
		Z: 			data.Z,
		RotX:		data.RotX,
		RotY:		data.RotY,
		RotZ:		data.RotZ,
		Entity:		Players[data.Id].Entity,
		State:		data.State,
		Name:		data.Name,
	}
	playerMapMutex.Unlock()

	_ = broadcastData("playerMoved", data, conn)
}
