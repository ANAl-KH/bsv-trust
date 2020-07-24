/*
import React from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
class TrustTime extends React.Component{
    constructor(props){
        super(props);
        this.state = {time:''};
        this.disableDate = this.disableDate.bind(this);
        this.handleonChange = this.handleonChange.bind(this);
        this.handleonOk = this.handleonOk.bind(this);
    }
    handleonChange(value,dateString){
        console.log(value);
        console.log(value._d);
        console.log(moment(value._d).unix());
        console.log(dateString);
    }
    handleonOk(value){
        this.setState({time:value});
        console.log(this.state.time);
    }
    disableDate(current){
        return current < moment().startOf('day');
    }
    render(){
        return(
            <div>
                <DatePicker disabledDate={this.disableDate} showTime onChange={this.handleonChange} onOk={this.handleonOk} />
            </div>
        );
    }
}
export default TrustTime;
*/