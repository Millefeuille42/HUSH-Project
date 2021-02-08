package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
)

type chatS struct {
	name	string
	message	string
}

func handleChat(message GameMessage, conn *websocket.Conn) error {
	data := PlayerUpdate{}
	err := mapstructure.Decode(message.Data, &data)
	if err != nil {
		return err
	}

	fmt.Println(message)
	_ = broadcastData("chat", message.Data, conn)
	_ = sendData("chat", message.Data, conn)

	return nil
}