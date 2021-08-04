import React, { ReactChildren, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import useSWR from 'swr'

const filterOptionsList: { categories: { title: string, category: string, selections: string[] }[] } =
    {
        categories: [
            {
                title: "Good/Evil",
                category: "GoodEvil",
                selections: [
                    "Good",
                    "Neutral",
                    "Evil"
                ]
            },
            {
                title: "Lawful/Chaotic",
                category: "LawChaos",
                selections: [
                    "Lawful",
                    "Neutral",
                    "Chaotic"
                ]
            }
        ]
    };

type Mysfit = {
    mysfitId: string;
    name: string;
    species: string;
    description: string;
    age: number;
    goodevil: "Good" | "Neutral" | "Evil";
    lawchaos: "Lawful" | "Neutral" | "Chaotic";
    thumbImageUri: string;
    profileImageUri: string;
    likes: number;
    adopted: boolean;
};

/*
const mysfits: Misfit[] = [
    {
        mysfitId: "4e53920c-505a-4a90-a694-b9300791f0ae",
        name: "Evangeline",
        species: "Chimera",
        description: "Evangeline is the global sophisticate of the mythical world. You’d be hard pressed to find a more seductive, charming, and mysterious companion with a love for neoclassical architecture, and a degree in medieval studies. Don’t let her beauty and brains distract you. While her mane may always be perfectly coifed, her tail is ever-coiled and ready to strike. Careful not to let your guard down, or you may just find yourself spiraling into a dazzling downfall of dizzying dimensions.",
        age: 43,
        goodevil: "Evil",
        lawchaos: "Lawful",
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
        goodevil: "Neutral",
        lawchaos: "Lawful",
        thumbImageUri: "https://www.mythicalmysfits.com/images/cyclops_thumb.png",
        profileImageUri: "https://www.mythicalmysfits.com/images/cyclops_hover.png",
        likes: 0,
        adopted: false
    },

]
*/

const Dropdown: React.FC<{ title: string; category: string; selections: string[]; filterMysfits: (e: React.MouseEvent<HTMLElement>) => void}> = (props) => {
    const titleRef = useRef<HTMLElement | null>(null);
    const dropdownRef = useRef<HTMLElement | null>(null);

    const toggleDropdown = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        ["text-blue-500", "bg-blue-500", "text-white", "shadow"].forEach((className) => {
            titleRef.current.classList.toggle(className);
        });

        dropdownRef.current.classList.toggle("hidden");
    };

    return (
        <li key={props.title} role="option" className="mx-2 w-40">
            <a className="px-3 py-2 tracking-wide text-blue-500 rounded" onClick={toggleDropdown} ref={titleRef} href="#!" role="button" aria-haspopup="true" aria-expanded="false">{props.title}</a>
            <div className="border-2 border-gray-400 flex flex-col absolute mt-1.5 w-40 hidden bg-white shadow" ref={dropdownRef}>
                {props.selections.map((selection) => {
                    return (
                        <button key={`${selection}`} className="px-3 py-2 tracking-wide rounded text-left hover:bg-gray-100" onClick={(e) => { toggleDropdown(e); props.filterMysfits(e); }} data-filter={props.category} data-value={selection}>{selection}</button>
                    );
                })}
            </div>
        </li>
    );
};

const Button: React.FC<{ text: string; type: "primary" | "info"; onClick: (e: React.MouseEvent<HTMLElement>) => void }> = (props) => {
    switch (props.type) {
        case "primary":
            return (
                <button type="button" className="px-3 py-2 tracking-wide text-white bg-green-500 rounded hover:bg-green-700" onClick={props.onClick}>{props.text}</button>
            );
            break;
        case "info":
            return (
                <button type="button" className="px-3 py-2 tracking-wide text-white bg-blue-500 rounded hover:bg-blue-700" onClick={props.onClick}>{props.text}</button>
            );
            break;
    }
};

type ModalProps = {
    show: boolean;
    children: ReactNode;
    modalRef: React.MutableRefObject<HTMLElement | null>;
    handleClose: () => void;
};

const Modal: React.FC = ({show, children, modalRef, handleClose }: ModalProps) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    console.log(showHideClassName);
    const modalEl = (
        <>
            <div className={showHideClassName}>
                <section className="modal-main">
                    <button onClick={handleClose}>Close</button>
                    {children}
                </section>
            </div>
            <style jsx>{`
              .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
              }
              .modal-main {
                position: fixed;
                background: white;
                width: 60%;
                height: auto;
                top: 20%;
                left: 30%;
                padding: 3rem 2rem;
              }
              display-block {
                display: block;
              }
              display-none {
                display: none;
              }
            `}</style>
        </>
    );
    if (modalRef && modalRef.current) {
        return ReactDOM.createPortal(modalEl, modalRef.current);
    } else {
        return null;
    }
}

const Index: React.FC = () => {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const [fetchUrl, setFetchUrl] = useState('http://67c83b9e-default-mythicalm-761d-295002966.ap-northeast-1.elb.amazonaws.com/mysfits');
    const { data, error } = useSWR(fetchUrl);
    const filterMysfits = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const { filter, value } = e.currentTarget.dataset;
        setFetchUrl(`http://67c83b9e-default-mythicalm-761d-295002966.ap-northeast-1.elb.amazonaws.com/mysfits?filter=${filter}&value=${value}`);
    }
    const resetView = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setFetchUrl('http://67c83b9e-default-mythicalm-761d-295002966.ap-northeast-1.elb.amazonaws.com/mysfits');
    }
    const mysfitModalRef = useRef(null);
    const [show, setShow] = useState(false);
    const showMysfitDetail = () => {
        setShow(true);
    }

    if (!data) {
      return <div>Loading...</div>;
    }
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
                            return <Dropdown title={category.title} category={category.category} selections={category.selections} filterMysfits={filterMysfits}/>
                        })}
                        &nbsp;
                        <li>
                            <Button text={"View All"} onClick={resetView} type="primary"/>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="my-5 mx-5">
                <div className="flex flex-row flex-wrap">
                    {data.mysfits.map((mysfit) => {
                        return (
                            <div key={mysfit.mysfitId} className="border-2 border-red-200 w-1/3 p-3">
                                <br />
                                <p className="text-center">
                                    <strong>{mysfit.name}</strong>
                                    <br />
                                    <img src={mysfit.thumbImageUri} alt={mysfit.name} className="mx-auto"/>
                                    <br />
                                    <br />
                                    <Button text="View Profile" type="info" onClick={(e) => showMysfitDetail(mysfit)} />
                                </p>
                                <p>
                                    <br />
                                    <b>Species:</b> {mysfit.species}
                                    <br />
                                    <b>Good/Evil:</b> {mysfit.goodevil}
                                    <br />
                                    <b>Lawful/Chaotic:</b> {mysfit.lawchaos}
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
            <Modal modalRef={mysfitModalRef} show={show} handleClose={() => { setShow(false) }}>
                <div>Hello, world</div>
            </Modal>
            <div ref={mysfitModalRef}></div>
        </>
    );
}

export default Index;
