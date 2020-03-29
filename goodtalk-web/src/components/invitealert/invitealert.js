import React, { useRef, useState } from "react"
import "./invitealert.css"
import { Heading, Text } from "grommet"
import { useLocation } from "react-router-dom"
import copy from 'copy-to-clipboard';


const INVITE_TEXT = "Copy the link from below or from your URL bar:"
const INVITE_HEADER = "Joining Info"
const FILE_COPY_ICON = "file_copy"
const CLEAR_ICON = "clear"
const LINK_COPIED = "Link copied to clipboard!"
function InviteAlert(props) {
    const location = useLocation()
    const [linkCopied, setLinkCopied] = useState(false)
    const linkRef = useRef(null)
    const invitePath = location.pathname
    const inviteDomain = window.location.host
    const inviteProtocol = window.location.protocol
    const inviteLink = inviteProtocol + "//" + inviteDomain + invitePath


    const onClickCopy = () => {
        copy(inviteLink)
        setLinkCopied(true)
    }

    return (
        <div className="alert-container">
            <div className="alert-text">
                <div className="alert-heading">
                    <Heading alignSelf="center" level="3" color="brand">
                        {INVITE_HEADER}
                    </Heading>
                    <div className="alert-dismiss" onClick={props.hideInviteAlert}>
                        <i class="material-icons">{CLEAR_ICON}</i>
                    </div>
                </div>
                <Text>
                    {INVITE_TEXT}
                </Text>
                <div className="alert-divider" />
                <div className="alert-link" onClick={onClickCopy} ref={linkRef}>
                    <Text>
                        {inviteLink}
                    </Text>
                    <div className="alert-copy-icon">
                        <i class="material-icons">{FILE_COPY_ICON}</i>
                    </div>
                </div>
                {linkCopied && <div className="alert-copy-confirm">
                    <Text color="status-ok">
                        {LINK_COPIED}
                    </Text>
                </div>}
            </div>

        </div >
    )
}

export default InviteAlert;