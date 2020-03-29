import React, { useState } from "react"
import "./createchat.css"
import { Box, Form, FormField, Button, TextInput, Text } from 'grommet'
import { useHistory } from "react-router-dom"


const CREATE_CHAT_TEXT = "Start a chat room and share with your friends!"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const NEW_CHAT_ID_ENDPOINT = BACKEND_URL + "/newchatroomid"
const ROOM_PREFIX = "/rooms/"
const ENTER_CHAT_NAME = "Enter Chat Name"

const CreateChat = () => {
  const [chatName, setChatName] = useState("")
  const history = useHistory()
  const onTextChange = (e) => {
    setChatName(e.target.value)
  }
  const onSubmit = () => {
    const newChatURLWithName = `${NEW_CHAT_ID_ENDPOINT}?name=${chatName}`
    fetch(newChatURLWithName).then((response) => {
      console.log(response)
      return response.json()
    }).then((id) => {
      const url = ROOM_PREFIX + id
      history.push(url, { chatName: chatName })
    })
  }
  return (
    <Box
      direction='column'
      gap='small'
    >
      <Text>
        <b>{ENTER_CHAT_NAME}</b>
      </Text>
      <TextInput placeholder="Chat Room Name Here" onChange={onTextChange} />
      <Box alignSelf="center">
        <div className="create-chat-button">
          <Button type="submit" primary label="Create Chat" onClick={onSubmit} />
        </div>
      </Box>
    </Box>
  )
}

export default CreateChat;