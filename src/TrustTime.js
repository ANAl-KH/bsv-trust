import React from 'react';
import {DatePicker} from 'antd';
class TrustTime extends React.Component{
    constructor(props){
        super(props);
        this.state = {time:''};
        this.handleonChange = this.handleonChange.bind(this);
        this.handleonOk = this.handleonOk.bind(this);
    }
    handleonChange(value,dateString){
        console.log(value);
        console.log(dateString);
    }
    handleonOk(value){
        this.setState({time:value});
        console.log(this.state.time);
    }
    render(){
        return(
            <div>
                <DatePicker showTime onChange={this.handleonChange} onOk={this.handleonOk} />
            </div>
        );
    }
}
export default TrustTime;