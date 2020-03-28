import React, { useEffect } from "react"

function VideoChat() {
  useEffect(() => {
    setupJitsi()
  })
  function setupJitsi() {
    const domain = 'meet.jit.si';
    const options = {
      roomName: 'roomName',
      height: 400,
      parentNode: document.getElementById('jitsi-container'),
    }

    const api = new window.JitsiMeetExternalAPI(domain, options);
  }
  return (
    <div>
      <div
        id="jitsi-container"
      />
    </div>
  )
}

export default VideoChat;