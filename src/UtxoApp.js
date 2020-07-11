import React from 'react';
import UtxoInput from './UtxoInput';
import UtxoList from './UtxoList';

class UtxoApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {wif:''};
    }

    handleWifInput(gotwif){
        this.setState({wif:gotwif});
    //    console.log(this.state.wif);
    }
    render(){
        const isempty = (this.state.wif === '');
        return(
            <div>
                <UtxoInput onWif={this.handleWifInput.bind(this)}/>
                <div>
                {isempty
                ? null
                :<UtxoList wif={this.state.wif}/>
                }
                </div>
            </div>
        );
    }
}

export default UtxoApp;