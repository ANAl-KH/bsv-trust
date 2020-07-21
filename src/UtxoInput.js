import React from 'react';
class UtxoInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {wif:''};
        this.handleWifChange = this.handleWifChange.bind(this);
        this.handleWifClick = this.handleWifClick.bind(this);
    }

    handleWifChange(e){
        this.setState({wif: e.target.value});
    }

    handleWifClick(){
    //    const getwif = this.state.wif;
    //    console.log(getwif);
        this.props.onWif(this.state.wif);
    //    console.log(this.state.wif);
    //    this.setState({wif:''});
    }

    render(){
        const wif = this.state.wif;
        return(
            <fieldset>
                <div>在创建信托时请不要对该地址内的BSV进行操作，以免信托创建失败</div>
                <div>请输入WIF格式的私钥:</div>
                <input value={wif}
                onChange={this.handleWifChange} />
                <button onClick={this.handleWifClick}>确认
                </button>
            </fieldset>
        );
    }
}

export default UtxoInput;