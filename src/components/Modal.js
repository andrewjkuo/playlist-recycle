const Modal = ({ showModal, resetPl }) => {
    const showHideClassName = showModal ? "modal display-block" : "modal display-none"

    return (
        <div className={showHideClassName}>
            <div className="clickReset" onClick={resetPl}>
            </div>
            <div className="modal-main">
                <h2>Recycling Complete</h2>
                <p>
                    Thanks for using the Spotify Playlist Recycling Plant!
                    Your new playlist has been exported and is available
                    in Spotify.
                </p>
                <p>    
                    If you've found this tool useful and want
                    to &thinsp;
                    <a
                        href="https://www.buymeacoffee.com/dr00bot" 
                        target="_blank" 
                        rel="noreferrer"
                    >
                        <b>buy me a coffee</b>
                    </a>
                    &thinsp; I would appreciate it muchly! Check out some
                    of my other projects at &thinsp;
                    <a
                        href="https://dr00bot.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <b>dr00bot.com</b>
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default Modal