package main

import (
	"net/http"
	"log"
	"github.com/sony/sonyflake"
	"time"
)

type Server {
	Sonyflake *sonyflake.Sonyflake
}

func serverError(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func (s *Server) newChatroomId(w http.ResponseWriter, r *http.Request) {
	chatroomId, err := s.Sonyflake.NextID()
	if err != nil {
		serverError(w, err)
		return
	}
	fmt.FPrintf(w, "%d", chatroomId)
}

func InitSonyFlakeSettings() sonyflake.Settings {
	return &sonyflake.Settings{
		StartTime: time.Now()
	}
}

func NewServer() *Server {
	return &Server{
		Sonyflake: sonyflake.NewSonyflake(InitSonyFlakeSettings())
	}
}

func main() {
	server := NewServer()
	http.HandleFunc("/newchatroomid", server)
	log.Fatal(http.ListenAndServe(":8080", nil))
}