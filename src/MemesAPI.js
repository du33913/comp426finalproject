import React, {useState} from "react";

function MemesAPI(props) {
    let [responseObj, setResponseObj] = useState({});

    function getMeme() {
        fetch("https://dog.ceo/api/breeds/image/random", {
            "method": "GET",
        })
            .then(response => response.json())
            .then(response => {
                setResponseObj(response);
            })
            .catch(err => {console.log(err);
            })
    }

    return (
        <div className="App">
            <main>
                <div>
                    <br/>
                    <button className={"button"} onClick={getMeme}>Get cute dog photo! :)</button>
                    <br/>
                    <Conditions responseObj={responseObj}/>
                </div>
            </main>
        </div>
    )
}

function Conditions(props) {
    let checker = JSON.stringify(props.responseObj)
    if (checker === '{}') {
        return "";
    } else {
        let obj = JSON.parse(checker);
        return (
            <img src={obj.message} alt={""}/>
        )
    }
}

export default MemesAPI;