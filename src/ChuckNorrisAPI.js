import React, {useState} from "react";
import "./ChuckNorrisAPI.css"

function ChuckNorrisAPI(props) {

    let [responseObj, setResponseObj] = useState({});

    function getJoke() {
        fetch("https://api.chucknorris.io/jokes/random", {
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
                    {"Click on the button to get a Chuck Norris joke that's guaranteed to make you smirk. You'll get a new one each time :)"}
                    <br/>
                    <button className={"button"} onClick={getJoke}>Get Joke</button>
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
            <div>
                {obj.value}
            </div>
        )
    }
}

export default ChuckNorrisAPI;
