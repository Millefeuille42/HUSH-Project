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
	http.HandleFunc("/", httpEndpoint)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
