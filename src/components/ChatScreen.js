import {connect} from "react-redux";
import React,{Component} from "react";

import io from 'socket.io-client';

const colorPallete = {
    INDIGO: '#264653',
    GREEN: '#2A9D8F',
    YELLOW: '#E9C46A',
    BROWN: '#F4A261',
    RED: '#E76F51'
}

class MessageBubble extends Component {

    render() {
        let {side, text,name} = this.props.message;
        return (
            <div style={!side ? {} : messageBubbleStyles.bubbleWrapper}>
                <div style={messageBubbleStyles.bubble}>
                   <div style={messageBubbleStyles.usernameText(side)}>{name}</div>
                    <div style={messageBubbleStyles.text}>{text}</div>
                </div>
            </div>
        )
    }
}


const messageBubbleStyles = {
    bubbleWrapper: {
      alignSelf: 'flex-end'
    },
    bubble: {
        backgroundColor: '#E9C46A',
        textAlign:'center',
        borderRadius:'18px',
        margin: '10px',
        padding: '13px',
        display: 'inline-block',
    },
    text: {
        display: 'block'
    },
    usernameText: (side) =>  ({
        color: '#264653',
        textAlign: side ? 'end' : 'start',
        marginLeft: '10px',
        marginRight: '10px',

    })
}

class ChatScreen extends Component {

    state = {
        text: '',
        userName: '',
        messages: [],
        nameSetted: false,
        personConnected: []

    }
    socketio = null;

    addMessage(message){
        this.setState({...this.state, messages: [...this.state.messages,message], text:  message.side ? '' :this.state.message})
    }

    addPerson(person){
        if(!this.state.personConnected.find((item) => item.id === person.id)){
            this.setState({...this.state, personConnected: [...this.state.personConnected, person]});
        }else{
            this.setState({...this.state, personConnected: [...this.state.personConnected.filter((item) => item.id !== person.id), person]});
        }
    }

    removePerson(person){
       this.setState({...this.state,personConnected: this.state.personConnected.filter((item) => item.id !== person.id)});
    }

    componentDidMount() {
        this.socketio = io.connect('http://localhost:4000');

        this.socketio.on('new_message', (arg) => {
            this.addMessage({text: arg.message, side: false, name: arg.name})
        })
        this.socketio.on('new_person', (arg) => {
            this.addPerson(arg);
        })
        this.socketio.on('user_disconnect',(arg) => {
            this.removePerson(arg);
        })
    }

    handleChange(event) {
        this.setState({...this.state, text: event.target.value});
    }

    handleUserNameChange(event) {
        this.setState({ ...this.state,userName: event.target.value});
    }

    handleClick() {
        if(!this.state.nameSetted && this.state.userName.length < 1){
            alert("Укажите имя");
        }
        if(this.state.text.length < 1){
            return;
        }
        this.addMessage({text: this.state.text, side: true, name: this.state.userName})
        this.socketio.emit('send_message',{
            message: this.state.text,
                client: this.state.userName
            });
    }

    handleChangeUserName() {
        if(this.state.userName.length > 1){
            this.socketio.emit('change_username',{username: this.state.userName});
            this.setState({...this.state, nameSetted: true});
            alert('Имя успешно установлено');

        } else {
            alert('Имя не может быть пустым');
        }
    }


    render(){
        return (
            <div style={styleSheet.backStyle}>
                <div style={styleSheet.composer}>
                    <input
                        style={styleSheet.input}
                        type="text"
                        size="40"
                        onChange={this.handleUserNameChange.bind(this)}
                        placeholder={"Введите имя"}/>
                    <div style={styleSheet.sendButton} onClick={this.handleChangeUserName.bind(this)}>
                        <img src="https://img.icons8.com/plumpy/48/000000/filled-sent.png" style={styleSheet.sendIcon}/>
                    </div>
                </div>
            <div style={styleSheet.centerBlock}>
                <div style={styleSheet.connectedPersonPanel}>
                    {this.state.personConnected.map((item) => {
                        return (<p>{item.name}</p>)
                    })}
                </div>
                <div style={styleSheet.messagesContainer}>
                    {this.state.messages.map((item) => {
                        return (<MessageBubble message={item}/>)
                    })}
                </div>
            </div>

                <div style={styleSheet.composer}>
                    <input
                        style={styleSheet.input}
                        type="text"
                        size="40"
                        value={this.state.text}
                        onChange={this.handleChange.bind(this)}
                        placeholder={"Сообщение"}/>

                    <div style={styleSheet.sendButton} onClick={this.handleClick.bind(this)}>
                        <img src="https://img.icons8.com/plumpy/48/000000/filled-sent.png" style={styleSheet.sendIcon}/>
                    </div>
                </div>

            </div>
        )
    }

}

const styleSheet = {

    connectedPersonPanel: {
        backgroundColor: colorPallete.GREEN,
        marginRight: '10px',
        padding: '10px'

    },
    centerBlock: {
        flex:'1',
        display: 'flex',
        width: '75%'
    },
    sendIcon: {
        width: '30px',
        height: '30px',
        margin: '5px'
    },
    sendButton: {
        borderRadius: '20px',
        width: '40px',
        height: '40px',
        backgroundColor: colorPallete.YELLOW,
        display:'flex',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        borderWidth: '0px',
        padding: '5px',
        paddingLeft: '10px',
        fontWeight: '500',
        marginRight: '25px',
        display: 'block',
        fontSize: '1em',

    },
    composer: {
        display: 'flex',
        width: '75%',
        margin: '20px',
        justifyContent: 'center'

    },
    backStyle: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    messagesContainer: {
        backgroundColor: colorPallete.GREEN,
        borderRadius: '5px',
        width: '75%',
        margin: '0 auto',
        flex:'1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        padding: '10px'
    },


}

const mapStateToProps = (state) => {

    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps,{

})(ChatScreen);
