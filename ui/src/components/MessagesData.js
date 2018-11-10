import React from 'react';
import Messages from './Messages';

class MessagesData extends React.Component {
    constructor(props) {
        super(props);

        fetch('http://localhost:8000/messages', {
            mode: "cors"
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    messages : data.messages
                });
            });
    }

    render(){
        return (
            this.state && this.state.messages ?
                <Messages messages={this.state.messages} /> :
                <p>Loading...</p>
        );
    }
}

export default MessagesData;