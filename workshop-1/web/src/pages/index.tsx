import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';

const Modal = () => {
    const [isBrowser, setIsBrowser] = useState(false);
    useEffect(() => {
        setIsBrowser(true)
    });
    if (isBrowser) {
        return ReactDOM.createPortal(
            <div>Hello from modal</div>,
            document.getElementById("modal-root")
        );
    } else {
        return null;
    }
}

const filterOptionsList: { categories: { title: string, selections: string[] }[] } =
    {
        categories: [
            {
                title: "Good/Evil",
                selections: [
                    "Good",
                    "Neutral",
                    "Evil"
                ]
            },
            {
                title: "Lawful/Chaotic",
                selections: [
                    "Lawful",
                    "Neutral",
                    "Chaotic"
                ]
            }
        ]
    };

type Misfit = {
    mysfitId: string;
    name: string;
    species: string;
    description: string;
    age: number;
    goodEvil: "Good" | "Neutral" | "Evil";
    lawChaos: "Lawful" | "Neutral" | "Chaotic";
    thumbImageUri: string;
    profileImageUri: string;
    likes: number;
    adopted: boolean;
};

const mysfits: Misfit[] = [
    {
        mysfitId: "4e53920c-505a-4a90-a694-b9300791f0ae",
        name: "Evangeline",
        species: "Chimera",
        description: "Evangeline is the global sophisticate of the mythical world. You’d be hard pressed to find a more seductive, charming, and mysterious companion with a love for neoclassical architecture, and a degree in medieval studies. Don’t let her beauty and brains distract you. While her mane may always be perfectly coifed, her tail is ever-coiled and ready to strike. Careful not to let your guard down, or you may just find yourself spiraling into a dazzling downfall of dizzying dimensions.",
        age: 43,
        goodEvil: "Evil",
        lawChaos: "Lawful",
        thumbImageUri: "https://www.mythicalmysfits.com/images/chimera_thumb.png",
        profileImageUri: "https://www.mythicalmysfits.com/images/chimera_hover.png",
        likes: 0,
        adopted: false
    },
    {
        mysfitId: "2b473002-36f8-4b87-954e-9a377e0ccbec",
        name: "Pauly",
        species: "Cyclops",
        description: "Naturally needy and tyrannically temperamental, Pauly the infant cyclops is searching for a parental figure to call friend. Like raising any precocious tot, there may be occasional tantrums of thunder, lightning, and 100 decibel shrieking. Sooth him with some Mandrake root and you’ll soon wonder why people even bother having human children. Gaze into his precious eye and fall in love with this adorable tyke.",
        age: 2,
        goodEvil: "Neutral",
        lawChaos: "Lawful",
        thumbImageUri: "https://www.mythicalmysfits.com/images/cyclops_thumb.png",
        profileImageUri: "https://www.mythicalmysfits.com/images/cyclops_hover.png",
        likes: 0,
        adopted: false
    },

]

const Dropdown: React.FC<{ title: string; selections: string[]}> = (props) => {
    const toggleDropdown = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        ["text-blue-500", "bg-blue-500", "text-white", "shadow"].forEach((className) => {
            e.currentTarget.classList.toggle(className);

        });
        e.currentTarget.nextElementSibling.classList.toggle("hidden");
    };

    return (
        <li key={props.title} role="option" className="mx-2 w-40">
            <a className="px-3 py-2 tracking-wide text-blue-500 rounded" onClick={toggleDropdown} href="#!" role="button" aria-haspopup="true" aria-expanded="false">{props.title}</a>
            <div className="border-2 border-gray-400 flex flex-col absolute mt-1.5 w-40 hidden bg-white shadow">
                {props.selections.map((selection) => {
                    return (
                        <button key={`${selection}`} className="px-3 py-2 tracking-wide rounded text-left">{selection}</button>
                    );
                })}
            </div>
        </li>
    );
};

const Button: React.FC<{ text: string; }> = (props) => {
    return (
        <button type="button" className="px-3 py-2 tracking-wide text-white bg-green-500 rounded hover:bg-green-700">{props.text}</button>
    );
};

const Index: React.FC = () => {
    return (
        <>
            <div className="text-center">
                <img src="https://www.mythicalmysfits.com/images/aws_mythical_banner.png" className="w-2/3 mx-auto" />
            </div>
            <div className="hidden">
                <div >
                    <button type="button" id="logInButton" className="btn btn-info btn-lg d-none" data-toggle="modal" data-target="#loginModel">Log In / Register</button>
                    <button type="button" id="logOutButton" className="btn btn-danger btn-lg d-none">Log Out</button>
                </div>
            </div>
            <div className="hidden" id="loginModal" tabIndex={-1} role="dialog" aria-hidden="true">
                <div>
                    <div>
                        <div>
                            <button type="button" data-dismiss="modal" />
                            <span aria-hidden="true">&times;</span>
                            <span>Close</span>
                        </div>

                        <div>
                            <form id="loginForm">
                                <input type="text" id="email" name="email" placeholder="Email" />
                                <input type="text" id="pwd" placeholder="Password" />
                                <input type="submit" id="login-modal-button" name="login"value="Login" />
                            </form>
                            <div className="login-help">
                                <Link href="/register"><a>Register</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div id="filterMenu">
                    <ul className="flex items-center">
                        &nbsp;
                        {filterOptionsList.categories.map((category) => {
                            return <Dropdown title={category.title} selections={category.selections} />
                        })}
                        &nbsp;
                        <li>
                            <Button text={"View All"} />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="my-5 mx-5">
                <div className="flex flex-row">
                    {mysfits.map((mysfit) => {
                        return (
                            <div key={mysfit.mysfitId} className="border-2 border-red-200 w-1/3 p-3">
                                <br />
                                <p className="text-center">
                                    <strong>{mysfit.name}</strong>
                                    <br />
                                    <img src={mysfit.thumbImageUri} alt={mysfit.name} className="mx-auto"/>
                                    <br />
                                    <br />
                                    <button type="button" >View Profile</button>
                                </p>
                                <p>
                                    <br />
                                    <b>Species:</b> {mysfit.species}
                                    <br />
                                    <b>Good/Evil:</b> {mysfit.goodEvil}
                                    <br />
                                    <b>Lawful/Chaotic:</b> {mysfit.lawChaos}
                                    <span className="flex justify-end">
                                        <img id={`${mysfit.mysfitId}LikeIcon`} src="https://www.mythicalmysfits.com/images/like_icon_false.png" />
                                        <img id={`${mysfit.mysfitId}AlreadyLikedIcon`} src="https://www.mythicalmysfits.com/images/like_icon_true.png" className="hidden" />
                                    </span>
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Index;
