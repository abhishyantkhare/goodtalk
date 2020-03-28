import React, { useState } from "react"
import "./createchat.css"
import { Box, Form, FormField, Button } from 'grommet'


const CREATE_CHAT_TEXT = "Start a chat room and share with your friends!"

const CreateChat = () => {
  const [chatName, setChatName] = useState("")
  const onTextChange = (e) => {
    setChatName(e.target.value)
  }
  const onSubmit = () => {
    console.log(chatName)
  }
  return (
    <Box
      direction='column'
      align='center'
      backgroun='brand'
    >
      <Form>
        <FormField name="Chat Room Name" label={CREATE_CHAT_TEXT} onChange={onTextChange} />
        <Button type="submit" primary label="Get Started!" onClick={onSubmit} />
      </Form>
    </Box>
  )
}

export default CreateChat;