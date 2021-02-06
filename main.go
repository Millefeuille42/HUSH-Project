package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
var connList = make([]*websocket.Conn, 0)

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func readWebSocket(conn *websocket.Conn) {
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		fmt.Printf("\t%s -> %s\n", conn.RemoteAddr(), p)
		//for _, connection := range connList {
		//	_ = connection.WriteMessage(messageType, p)
		//}
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
	go log.Fatal(http.ListenAndServe(":8080", nil))

	fs := http.FileServer(http.Dir("./assets"))
	log.Fatal(http.ListenAndServe(":8000", fs))
}
