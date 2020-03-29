import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import "./videochat.css"
import InviteAlert from "../invitealert/invitealert"
import { Stack } from "grommet"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const GET_CHATROOM_ENDPOINT = BACKEND_URL + "/getchatroom"
function VideoChat() {
  useEffect(() => {
    var api;
    async function runSetup() {
      api = await setup()
    }
    runSetup()
    return function cleanup() {
      api.dispose()
    }
  })
  const location = useLocation()
  const roomId = location.pathname.split("/")[2]

  const [showInviteAlert, setShowInviteAlert] = useState(true)
  const hideInviteAlert = () => {
    setShowInviteAlert(false)
  }


  const setup = async () => {
    const getChatRoomURLWithId = `${GET_CHATROOM_ENDPOINT}?id=${roomId}`
    const api = await fetch(getChatRoomURLWithId).then((response) => {
      return response.json()
    }).then((chatroom) => {
      return setupJitsi(chatroom["Name"])
    })
    return api
  }
  const setupJitsi = (chatName) => {
    const domain = "meet.jit.si"
    const config = {
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'feedback', 'invite', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
      ],
    }
    const options = {
      roomName: roomId,
      height: "100%",
      width: "100%",
      parentNode: document.getElementById('jitsi-container'),
      interfaceConfigOverwrite: config,
    }

    const api = new window.JitsiMeetExternalAPI(domain, options);
    api.executeCommand('subject', chatName);
    return api;
  }
  return (
    <Stack>

      <div className="container">
        {showInviteAlert && <InviteAlert hideInviteAlert={hideInviteAlert} />}
      </div>
      <div>
        <div
          id="jitsi-container"
          className="jitsi-container"
        />
      </div>
    </Stack>
  )
}

export default VideoChat;