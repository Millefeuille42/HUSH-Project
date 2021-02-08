package main

import (
	"io/ioutil"
	"log"
	"net/http"
)

func httpEndpoint(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadFile(r.URL.Path[1:])
	if err != nil {
		return
	}
	_, _ = w.Write(body)
}

func main() {
	fs := http.FileServer(http.Dir("./assets"))
	http.Handle("/", fs)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
