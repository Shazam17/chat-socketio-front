import {connect} from "react-redux";
import {Component} from "react";
import io from 'socket.io-client';


class MessageBubble extends Component {

    render() {
        let {side, text} = this.props.message;
        return (
            <div style={!side ? {} : messageBubbleStyles.bubbleWrapper}>
                <div style={messageBubbleStyles.bubble}>
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
    }
}

class ChatScreen extends Component {

    state = {
        text: '',
        userName: '',
        messages: []
    }
    socketio = null;

    addMessage(message){
        console.log(message);
        this.setState({...this.state, messages: [...this.state.messages,message]})
    }

    componentDidMount() {
        this.socketio = io.connect('http://localhost:4000');

        this.socketio.on('hi', (arg) => {
            // console.log(arg);
        })
        this.socketio.on('connection',(socket) => {
            // console.log('new user connected');

        });
        this.socketio.on('new_message', (arg) => {
            // console.log(`new message`)
            this.addMessage({text: arg.message, side: false})
            // console.log(arg);
        })
    }

    handleChange(event) {
        // console.log(event);
        this.setState({...this.state, text: event.target.value});
    }

    handleUserNameChange(event) {
        this.setState({ ...this.state,userName: event.target.value});
    }

    handleClick() {
        // console.log(this.state);
        this.addMessage({text: this.state.text, side: true})
        this.socketio.emit('send_message',{
            message: this.state.text,
                client: this.state.userName
            });
    }

    handleChangeUserName() {
        this.socketio.emit('change_username',{username: this.state.userName});
    }


    render(){
        return (
            <div style={styleSheet.backStyle}>

                <div>
                    <p>enter name</p>
                    <input style={styleSheet.messagesContainer} type="text" size="40" onChange={this.handleUserNameChange.bind(this)}/>
                    <div style={styleSheet.sendButton} onClick={this.handleChangeUserName.bind(this)}>send</div>
                </div>

            <div style={styleSheet.messagesContainer}>
                {this.state.messages.map((item) => {
                    return (<MessageBubble message={item}/>)
                })}
            </div>
                <div style={styleSheet.composer}>
                    <input style={styleSheet.input} type="text" size="40" value={this.state.text} onChange={this.handleChange.bind(this)} placeholder={"Сообщение"}/>
                    <div style={styleSheet.sendButton} onClick={this.handleClick.bind(this)}>send</div>
                </div>

            </div>
        )
    }

}

const styleSheet = {
    input: {
        backgroundColor: '#FFFFFF',
        // borderWidth: '1px',
        // borderColor: '#E76F51',
        borderRadius: '12px',
        padding: '5px',
        paddingLeft: '10px',
        fontWeight: '500',
        marginRight: '25px',
        display: 'block',
        fontSize: '1em'
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
        alignItems: 'center'

    },
    messagesContainer: {
        backgroundColor: '#2A9D8F',
        width: '75%',
        margin: '0 auto',
        flex:'1',
        border: '1px solid black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        padding: '10px'
    },
    sendButton: {
        height: '25px',
        width: '50px',
        backgroundColor: 'grey',
        display:'block',
    }

}

const mapStateToProps = (state) => {

    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps,mapDispatchToProps)(ChatScreen);
