import React, { useState } from 'react';
import { useTrail, animated, config } from 'react-spring';

const whatsNew = [
    {
        imagePath: 'images/menu.png',
        title: 'Right Click Menu',
        message:
            "Access frequently used links like the PPM Dashboard, RelayTime settings page, What's New page, and viewing the source on github.",
    },
    {
        imagePath: 'images/popover.png',
        title: 'Save & Submit',
        message:
            "You can now save AND submit with one button when adding your hours.",
    },
    {
        imagePath: 'images/modal.png',
        title: 'What\'s New',
        message:
            "This! I added a modal to display what changes that have been made since the last update.",
    },
];

export default function WhatsNew({ onClose }) {
    const trail = useTrail(whatsNew.length, {
        config: config.slow,
        opacity: 1,
        from: { opacity: 0 },
    });

    return (
        <div className="overlay">
            <div className="dialog">
                <div className="content">
                    <div className="content">
                        <div className="header">
                            <h5 class="modal-title">What's New</h5>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={onClose}
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="body">
                            {trail.map((style, index) => (
                                <animated.div
                                    key={whatsNew[index].title}
                                    className="flex-row"
                                    style={style}
                                >
                                    <img
                                        className="menu-image"
                                        src={whatsNew[index].imagePath}
                                        alt={whatsNew[index].title}
                                    />
                                    <div className="menu-copy">
                                        <h3>{whatsNew[index].title}</h3>
                                        <span>{whatsNew[index].message}</span>
                                    </div>
                                </animated.div>
                            ))}
                        </div>
                        <div className="footer">
                            <button
                                type="button"
                                class="btn btn-outline-primary"
                                onClick={onClose}
                            >
                                Thanks!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
