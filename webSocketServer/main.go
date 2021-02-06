package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/mitchellh/mapstructure"
	"log"
	"net/http"
	"strings"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
var connList = make([]*websocket.Conn, 0)

func readWebSocket(conn *websocket.Conn) {
	message := GameMessage{}

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		fmt.Printf("\t%s -> %s\n", conn.RemoteAddr(), p)

		if strings.HasPrefix(string(p), "initialize") {
			initializePlayer(conn)
		} else {
			err = json.Unmarshal(p, &message)
			if err != nil {
				continue
			}
			if strings.HasPrefix(message.Method, "positionUpdate") {
				data := PlayerUpdate{}
				err = mapstructure.Decode(message.Data, &data)
				if err != nil {
					continue
				}
				positionUpdate(conn, data)
			}
		}
	}
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	log.Println("Client" + ws.RemoteAddr().String() + "connected")

	connList = append(connList, ws)
	initializePlayer(ws)
	readWebSocket(ws)
}

func main() {
	http.HandleFunc("/", wsEndpoint)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
