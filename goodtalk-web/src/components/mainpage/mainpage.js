import React from "react"
import { Heading, Text, Box, Footer } from "grommet"
import CreateChat from "../createchat/createchat"
import "./mainpage.css"

const TITLE = "Support The Fight Against COVID-19 While Sheltering In Place"
const BOLD_DONATION_TEXT = "100% of the ad revenue will be donated to the "
const DONATION_LINK = "https://www.unitedway.org/recovery/covid19"
const DONATION_NAME = "United Way Worldwide's COVID-19 Community Response and Recovery Fund."
const DESC_1 = "Do some good while talking face-to-face with your loved ones. This website provides a free videochat tool with some non-intrusive ads. "
const DESC_2 = " Stay safe, shelter in place, and help those on the frontlines of the coronavirus crisis."
const FOOTER_TEXT_1 = "Video chat on this website is powered by "
const JITSI_MEET_TEXT = "Jitsi Meet."
const FOOTER_TEXT_2 = " You can view the source code on "
const GITHUB_TEXT = "Github."
const FOOTER_TEXT_3 = " Feel free to submit an issue or PR!"
const JITSI_MEET_LINK = "https://github.com/jitsi/jitsi-meet"
const GITHUB_REPO_LINK = "https://github.com/abhishyantkhare/goodtalk"
const MainPage = () => {
    return (
        <div>
            <div className="container">
                <div className="title-container">
                    <Box
                        direction="column"
                        gap="small"
                        pad="small"
                    >
                        <Heading level="1" color="brand">
                            {TITLE}
                        </Heading>
                        <Text>
                            {DESC_1}
                            <b>
                                {BOLD_DONATION_TEXT}
                                <a href={DONATION_LINK}>{DONATION_NAME}</a>
                            </b>
                            {DESC_2}
                        </Text>
                        <div className="create-chat-container">
                            <CreateChat />
                        </div>
                    </Box>
                </div>
            </div>
            <div className="footer">
                <div className="footer-text">
                    <Text size="xxsmall">
                        {FOOTER_TEXT_1}
                        <a href={JITSI_MEET_LINK}>{JITSI_MEET_TEXT}</a>
                        {FOOTER_TEXT_2}
                        <a href={GITHUB_REPO_LINK}>{GITHUB_TEXT}</a>
                        {FOOTER_TEXT_3}
                    </Text>
                </div>
            </div>
        </div>
    )
}

export default MainPage;