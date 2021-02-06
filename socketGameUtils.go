package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
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

type GameMessage struct {
	Method	string		`json:"method"`
	Data	interface{}	`json:"data"`
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

	message := GameMessage {
		Method: "playerData",
		Data:   PlayerData{
			Id:      player.Id,
			Players: Players,
		},
	}
	allMessage := GameMessage {
		Method: "playerJoined",
		Data:	player,
	}

	allMessageJson, err := json.Marshal(allMessage)
	messageJson, err := json.Marshal(message)
	if err != nil {
		log.Print(err)
		return
	}

	for _, connection := range connList {
		_ = connection.WriteMessage(1, allMessageJson)
	}

	_ = conn.WriteMessage(1, messageJson)
}

func positionUpdate(conn *websocket.Conn) {



	for _, connection := range connList {
		if connection != conn {
			connection.WriteMessage()
		}
	}
}
