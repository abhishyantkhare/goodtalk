package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/samsarahq/go/oops"
	"github.com/sony/sonyflake"
)

type Server struct {
	Sonyflake *sonyflake.Sonyflake
	DB        *sql.DB
}

type ChatRoom struct {
	Id   uint64
	Name string
}

func serverError(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func (s *Server) CreateChatRoomTable(tx *sql.Tx) error {
	_, err := tx.Exec("CREATE TABLE IF NOT EXISTS chatrooms (id varchar(255), name varchar(255), primary key (id))")
	if err != nil {
		return oops.Wrapf(err, "error creating chatroom table")
	}
	return nil
}

func (s *Server) CreateTables() error {
	tx, err := s.DB.Begin()
	if err != nil {
		return oops.Wrapf(err, "error opening transaction")
	}
	defer tx.Rollback()
	if err := s.CreateChatRoomTable(tx); err != nil {
		return oops.Wrapf(err, "error creating chat room table")
	}
	if err := tx.Commit(); err != nil {
		return oops.Wrapf(err, "error committing transaction")
	}
	return nil
}

func GetParam(r *http.Request, param string) (string, error) {
	params, ok := r.URL.Query()[param]
	if !ok || len(params[0]) < 1 {
		return "", oops.Errorf("no %s in request", param)
	}
	return params[0], nil
}

func (s *Server) NewChatroomId(w http.ResponseWriter, r *http.Request) {
	chatroomId, err := s.Sonyflake.NextID()
	if err != nil {
		serverError(w, err)
		return
	}
	chatRoomName, err := GetParam(r, "name")
	if err != nil {
		serverError(w, oops.Wrapf(err, "error fetching name from request"))
		return
	}
	chatRoom := &ChatRoom{
		Id:   chatroomId,
		Name: chatRoomName,
	}
	s.AddChatRoom(r.Context(), chatRoom)
	fmt.Fprintf(w, "%d", chatroomId)
}

func (s *Server) AddChatRoom(ctx context.Context, chatRoom *ChatRoom) error {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return oops.Wrapf(err, "error opening transaction")
	}
	defer tx.Rollback()
	stmt, err := s.DB.Prepare("INSERT INTO chatrooms (id, name) values (?, ?)")
	if err != nil {
		return oops.Wrapf(err, "error preparing statement")
	}
	defer stmt.Close()
	if _, err := stmt.Exec(chatRoom.Id, chatRoom.Name); err != nil {
		return oops.Wrapf(err, "Error inserting into db")
	}
	if err := tx.Commit(); err != nil {
		return oops.Wrapf(err, "Error committing transaction")
	}
	return nil
}

func (s *Server) GetChatRoomHandler(w http.ResponseWriter, r *http.Request) {
	idStr, err := GetParam(r, "id")
	if err != nil {
		serverError(w, oops.Wrapf(err, "error fetching id from request"))
		return
	}
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		serverError(w, oops.Errorf("error converting id to int"))
		return
	}
	chatRoom, err := s.GetChatRoomById(r.Context(), id)
	if err != nil {
		serverError(w, err)
		return
	}
	if err := json.NewEncoder(w).Encode(chatRoom); err != nil {
		serverError(w, err)
		return
	}

}

func (s *Server) GetChatRoomById(ctx context.Context, chatRoomId uint64) (*ChatRoom, error) {
	tx, err := s.DB.BeginTx(ctx, nil)
	if err != nil {
		return nil, oops.Wrapf(err, "error opening transaction")
	}
	defer tx.Rollback()
	chatRoom := &ChatRoom{
		Id: chatRoomId,
	}
	row := tx.QueryRowContext(ctx, "SELECT name from chatrooms where id = ?", chatRoomId)
	if err := row.Scan(&chatRoom.Name); err != nil {
		return nil, oops.Wrapf(err, "error scanning db data for id %d", chatRoomId)
	}
	return chatRoom, nil
}

func InitSonyFlakeSettings() sonyflake.Settings {
	return sonyflake.Settings{
		StartTime: time.Now(),
	}
}

func NewServer(dbHost string) (*Server, error) {
	db, err := sql.Open("mysql", dbHost)
	if err != nil {
		return nil, oops.Wrapf(err, "error connecting to db")
	}
	s := &Server{
		Sonyflake: sonyflake.NewSonyflake(InitSonyFlakeSettings()),
		DB:        db,
	}
	if err := s.CreateTables(); err != nil {
		return nil, oops.Wrapf(err, "error creating tables")
	}
	return s, nil
}

func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

}

func main() {
	dbHost, ok := os.LookupEnv("GOODTALKDBHOST")
	if !ok {
		log.Fatalf("DB Not found")
	}
	server, err := NewServer(dbHost)
	if err != nil {
		log.Fatalf(err.Error())
	}
	http.HandleFunc("/newchatroomid", server.NewChatroomId)
	http.HandleFunc("/getchatroom", server.GetChatRoomHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
