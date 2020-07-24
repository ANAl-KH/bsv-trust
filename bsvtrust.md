#BsvTrust文档
##BsvTrust概览
老王有一个13岁的儿子小王，老王还有很多的BSV，但是只有他自己掌握了这些BSV的私钥，如果老王发生了什么意外，这些BSV就丢失了，所以老王用BsvTrust
创建了一个信托，老王的BSV仍然在他的地址里，但是等到5年后信托将会自动把这些BSV发送到小王的地址里，有了信托的保障老王再也不用担心小王成年后的生
活问题了。而这5年期间老王随时可以用自己的私钥取消这个信托。
###BsvTrust原理
比特币交易中有一个字段叫做nLockTime，如果在创建一笔比特币交易时设置了nLockTime，那么这笔交易在到达设定的时间之前是无效的，无法被矿工打包。所
以很容易想到老王可以构造一笔将自己的BSV发送到小王地址的交易，并且把nLockTime设定为5年，这样小王等到5年后将这笔交易交给矿工打包就可以拿到老王
的BSV了，而这五年间老王只要操作一下自己的BSV就能使小王手里的交易因输入无效而变得无效。
上面这个方案实现了大部分功能，但是没有实现“自动”，小王需要自己保管nLockTime交易5年，5年后还需要手动将交易塞给矿工，现在让我们来改进它，老王
构建完成nLockTime交易后把交易上链，让其他人帮小王保存这笔交易并等到5年后把这笔交易塞给矿工，这样对于小王来说就实现了全自动。
当然在比特币的世界里一切都是经济激励，想让其他人帮小王做事就得让他们在做完事之后得到报酬，比特币有一种签名类型叫SigHash Single，使用SigHash 
Single签名的输入只会锁定对应的那一个输出，而其他的输出可以被任意更改而不影响整个交易的有效性，老王在构造nLockTime交易的时候可以使用SigHash 
Single签名，把给小王的输出锁定住，另外构造一个小额的可以被任意更改的输出。现在，帮小王保存5年交易并塞给矿工的人可以拿到第二个输出里的BSV，在
经济激励下我们实现了真正的全自动信托。
#BsvTrust原型
BsvTrust是一个网页应用，可以让用户构建信托，共有3步：
![](bsvtrust_files/1.jpg)
1、 用户输入自己的私钥，因为HD钱包过于麻烦，我们暂时只支持单个地址的私钥，私钥要求为WIF格式。
    使用私钥计算出对应的地址，使用地址通过metasv.com的API查询该地址内的余额，得到构建交易所需的未花费输出——UTXO集合。
	metasv.com返回的UTXO数据有缺陷，为了符合BSV库的要求，我们对UTXO进行改造。
```javascript
async handleWifClick (){
        var wif = this.state.wif;
        this.setState({success:false});
        try{
            var privateKey = bsv.PrivateKey.fromWIF(wif);
            var scriptPubKey = toScriptPubKey(toAddress(wif));
            var address = toAddress(wif)+'/utxo';//计算出对应的地址
            try{
                var res = await fetch(`/api/${address}`);//查询UTXO
                var utxoObj = await res.json();
                console.log(utxoObj);
                if (utxoObj.code === 200 && utxoObj.success === true){
                    if(utxoObj.data!==[]){
                        var utxoData = utxoObj.data;
                        var totalBsvSat = parseInt(utxoData.reduce((totalSatoshis,item) => totalSatoshis + item.value,0));
                        var totalBsv = totalBsvSat/100000000;
                        if(totalBsvSat > parseInt(1350000)){
                            if(parseInt(utxoData.reduce((totalAncestors,item) => totalAncestors + item.ancestors,0)) < parseInt(20)){
                                utxoData.forEach(element => {//对有缺陷的UTXO进行处理
                                    element['satoshis']=element['value'];
                                    element['scriptPubKey']=scriptPubKey;
                                    this.setState({err:`成功导入私钥，余额为${totalBsv}BSV`,success:true,utxo:utxoData,privateKey:privateKey,totalBsvSat:totalBsvSat,scriptPubKey:scriptPubKey});
                                });
                            }else{this.setState({err:'未确认utxo链式调用超过25层，请稍后再创建信托'})}
                        }else{this.setState({err:'该地址余额不足，最少需要0.0135BSV'})}
                    }else{this.setState({err:'该地址可用余额为零'})}
                }else{this.setState({err:'metasv.com服务器连接出错，无法查询余额'})}
            }catch(e){this.setState({err:'您的网络连接不正常，无法查询该地址余额'})}
        }catch(e){this.setState({err: '输入的私钥格式错误，请输入正确的wif格式私钥'})}
    }
```
2、让用户设定信托生效的日期和信托的目标地址
3、构造交易，共需要构建3笔交易。
   (1)构建第一笔交易：用户的地址里可能会有大量的杂乱的UTXO，因此我们首先要整理这些UTXO，将所有UTXO作为输入，输出3个输出。
      第一个输出是我们网站的手续费，地址是我们的收款地址，金额40万聪。
	  第二个输出是用来构建第三笔交易用的，地址是用户的原地址，金额230聪。
	  第三个输出用来作为nLockTime交易的输入，地址是用户的原地址，金额是用户总余额减去前两个输出后的余额。
```javascript
var reduceTx = bsv.Transaction().from(this.props.utxo).to('1KXZ29ssLh83hZcuzHAADXso37tUYt3Saw',400000).to(trustAddress,230).to(trustAddress,reduceSat).sign(this.props.privateKey);
var rawReduceTx = reduceTx.toBuffer().toString('hex');
```
   (2)构建第二笔交易：nLockTime交易，输入是第一笔交易的第三个输出，根据用户设定的信托生效时间设定nLockTime值，使用SigHash Single签名。
      第一个输出是给小王的钱，地址是信托目标地址，金额是输入金额减去留给第二个输出的90万聪。
	  第二个输出是留给帮小王保存并广播交易的人，这个输出将可以被随意更改，地址是用户原地址，金额是90万聪。
```javascript
var trustTx = bsv.Transaction().from(trustUtxo).to(correctTargetAddress,reduceSat-900130).to(correctTargetAddress,900000).lockUntilDate(this.state.time).sign(this.props.privateKey,3);
var rawTrustTx = trustTx.toBuffer().toString('hex');
```
   (3)构建第三笔交易，第三笔交易用来将第二笔交易的原始数据上传到BSV链上，输入是第一笔交易的第二个输出，输出只有一个opreturn。
      opreturn中就是第二笔交易的原始数据。
```javascript
var carrierTx = bsv.Transaction().from(carrierUtxo).addSafeData(rawTrustTx).sign(this.props.privateKey);
var rawCarrierTx = carrierTx.toBuffer().toString('hex');
```
前三步的代码我都测试过了，都可以正常工作。

4、广播交易，共需要广播2笔交易。
   写到这里写不出来了，遇到了跨域的问题，之前用地址查询余额那里设置了一个跨域，现在广播交易这里再设置跨域就报错。
   将第一笔和第三笔交易的原始数据，也就是rawReduceTx和rawCarrierTx，通过[metasv.com](https://metasv.com/#bc60c7b38b)的接口post过去。
   post成功之后即可显示信托创建成功。