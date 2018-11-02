import React, { Component } from 'react';
import ChatItem from './ChatItem'
import { connect } from 'react-redux';
import { chatMessage } from '../actions/MessageActions';
import InfiniteScroll from 'react-infinite-scroller';


  
class ChatContent extends Component {  
    componentDidUpdate() {
        var frame = document.getElementById('chat-content');
        if (frame) {
            frame.scrollTop = frame.scrollHeight;
        }    
    }




//       [{id: 2, username: "thao", content: "hê hê", time: 1541083055615},   
//       {id: 2, username: "thao", content: "hêdasd hê", time: 1541083055615}
//    , {id: 3, username: "toan", content: "hê hê", time: 1541084296901}
//     , {id: 4, username: "toan", content: "hê hê", time: 1541084297114}
//      ,{id: 5, username: "toan", content: "hê hê", time: 1541084297303}
//     , {id: 6, username: "toan", content: "hê hê", time: 1541084297456}
//     , {id: 7, username: "toan", content: "hê hê", time: 1541084297599}
//     , {id: 8, username: "toan", content: "hê hê", time: 1541084297913}
//     , {id: 9, username: "toan", content: "hê hê", time: 1541084298209}
//      ,{id: 10, username: "toan", content: "hê hê", time: 1541084298489}
//     , {id: 11, username: "toan", content: "hê hê", time: 1541084299015}
//     , {id: 12, username: "toan", content: "hê hê", time: 1541084299283}
//      ,{id: 13, username: "toan", content: "hê hê", time: 1541084299524}
//      , {id: 14, username: "toan", content: "hê hê", time: 1541084299786}
//      , {id: 15, username: "toan", content: "hê hê", time: 1541084300041}
//     , {id: 16, username: "toan", content: "hê hê", time: 1541084300301}
//      ,{id: 17, username: "toan", content: "hê hê", time: 1541084300514}
//      ,{id: 18, username: "toan", content: "hê hê", time: 1541084300914}
//     , {id: 19, username: "toan", content: "hê hê", time: 1541084301355}
//      ,{id: 20, username: "toan", content: "hê hê", time: 1541084301816}
//     , {id: 21, username: "toan", content: "hê hê", time: 1541084302106}
//   , {id: 22, username: "toan", content: "hê hê", time: 1541084302379}
//    ,   {id: 23, username: "toan", content: "hê21321 hê", time: 1541084302625}
//     , {id: 24, username: "toan", content: "v", time: 1541084302864}]




    render() {
        const loader = <div className="loader">Loading ...</div>;
        const { message } = this.props;
        var listMessage = (typeof message) !== "undefined" ? message.listMessage : [];
        if (typeof listMessage !== "undefined")
        {
            return (
                <div>
                    {listMessage.map((e, i) =>
                        <ChatItem
                            key={i}
                            contentchat={e} />
                    )}





            {/* <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={loader}>

                <div className="tracks">
                    
                {listMessage.map((e, i) =>
                        <ChatItem
                            key={i}
                            contentchat={e} />)}    
                </div>
            </InfiniteScroll> */}








                </div>
            );
        } else {
            return ''
            
        }

    }
}


const mapStateToProps = state => ({
    message: state.message,
});

const mapDispatchToProps = (dispatch) => ({
    chatMessage: (chatObj) => dispatch(chatMessage(chatObj))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatContent);
