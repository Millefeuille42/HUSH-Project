package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
)

type GameMessage struct {
	Method	string		`json:"method"`
	Data	interface{}	`json:"data"`
}

func broadcastData(method string, data interface{}, conn *websocket.Conn) error {
	message := GameMessage{
		Method: method,
		Data:   data,
	}

	messageJson, err := json.Marshal(message)
	if err != nil {
		log.Print(err)
		return err
	}

	wsMutex.Lock()
	for _, connection := range connList {
		if connection != conn {
			_ = connection.WriteMessage(1, messageJson)
		}
	}
	wsMutex.Unlock()
	return nil
}

func sendData(method string, data interface{}, conn *websocket.Conn) error {
	message := GameMessage{
		Method: method,
		Data:   data,
	}

	messageJson, err := json.Marshal(message)
	if err != nil {
		log.Print(err)
		return err
	}
	wsMutex.Lock()
	err = conn.WriteMessage(1, messageJson)
	wsMutex.Unlock()
	return err
}
