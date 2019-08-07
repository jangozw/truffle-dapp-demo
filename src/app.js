//web3 js 跟 合约的交互

//Voting 是voting合约，可直接访问其方法
var Voting;
//web3 是必须的变量
var web3;

App = {
    web3Url: "http://127.0.0.1:7545",//地址是部署到ganache 测试网络。下载安装ganache图形界面版本会有提供
    web3Provider: null,
    Voting: null,
    init: function(){
        return App.initWeb3();
    },
    //初始化web3!!! 
    initWeb3: function(){
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(App.web3Provider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider(App.web3Url);
            web3 = new Web3(App.web3Provider);
        }
        //这一句很重要，调用合约设置合约变量时候，没有的话会报错：Error: invalid address
        web3.eth.defaultAccount=web3.eth.coinbase;
        console.log("web3.js 版本：", web3.version);
        console.log("web3: ", web3);
        console.log("web3账户信息:", web3.eth.accounts);
        return App.initContract();
    },
    //初始化调用合约
    initContract: function(){
        $.ajax({
            type : "GET",
            async: false, // 设置为同步，主要为了设置Voting的值
            url : "Voting.json",
            contentType: "application/json",
            dataType: 'json',
            success : function(data){
                //使用App.Voting 可以直接调用合约的方法了， 如App.Voting.test();
                Voting = TruffleContract(data);
                Voting.setProvider(App.web3Provider);
                App.Voting = Voting;
                console.log("合约是: ", App.Voting);
                //调用合约示例
                App.Voting.deployed().then(function(contractInstance) {
                    return contractInstance.test2();
                }).then(function(v) {
                    console.log("调用合约测试成功: "+v);
                }).catch(function(err) {
                    console.log("调用合约测试失败:", err.message);
                });
                return App.initData();
            }
        })
    },
    initData: function(){
        App.getCandidates();
    },
    // 给人投票
    voteForCandidate: function(name){
        let candidate = web3.fromAscii(name);
        Voting.deployed().then(function(contractInstance){
            return contractInstance.voteForCandidate(candidate);
        }).then(function(res){
            console.log("投票"+name+"成功!");
        }).catch(function(err){
            console.log("投票"+name+"失败!", err.message);
        });
    },

    //获取某人的投票数量
    getTotalByCandidate: function(name, trNode){
        let candidate = web3.fromAscii(name);
        Voting.deployed().then(function(contractInstance){
            return contractInstance.getTotalByCandidate(candidate);
        }).then(function (res){
            //合约返回uint ，则js的toNumber()一定要调用, 不然看到的是一个奇怪的object
            console.log("获取"+name+"投票数量成功:", res.toNumber());
            callbackTotal(res.toNumber(), name, trNode);
        }).catch(function(err){
            console.log("获取"+name+"投票数量失败:"+err.message);
        });
    },

    //获取候选人列表
    getCandidates: function (){
        Voting.deployed().then(function(contractInstance){
            return contractInstance.getCandidates();
        }).then(function (res){
            console.log("获取候选人成功", res);
            for (var i = 0;i < res.length; i++) {
                //Web3.toAscii() 将bytes32 转为string
                let name = web3.toAscii(res[i]);
                console.log("候选人是"+i+":",name );
                addTableCandidate(name, null);
                App.getTotalByCandidate(name);
            }
        }).catch(function(err){
            console.log("获取候选人失败"+err.message);
        });
    },
};

//
$(function() {
    $(window).load(function() {
      App.init(); //主要用来初始化web3,和Voting变量
    });
});

//根据候选人生成列表
function addTableCandidate(name, count){
    var html = "<tr class=\"name_"+name+"\"><td class=\"name\">"+name+"</td> <td class=\"count\">"+count+"</td> <td><a href='javascript:void(0)' onclick=\"userClickVote(this)\">投票</a></td> </tr>";
    $("#vote").append(html);
}
//点击投票
function userClickVote(obj){
    let nameNode = $(obj).parents("tr").find(".name");
    let countNode = $(obj).parents("tr").find(".count");
    let candidate = web3.fromAscii(nameNode.html());
    console.log(web3.toAscii(candidate));
    Voting.deployed().then(function(contractInstance){
        let weivalue = web3.toWei(0.1, 'ether');
        return contractInstance.voteForCandidate(candidate, {value: weivalue});
    }).then(function(res){
        console.log(nameNode.html()+"投票成功!", res);
        App.getTotalByCandidate(nameNode.html(), countNode.parents("tr"));
    }).catch(function(err){
        console.log(nameNode.html()+"投票失败!", err.message);
        $("#tip").html("投票失败!"+err.message);
    });
}

function callbackTotal(num, name, trNode) {
    if (! trNode) {
        trNode = $("tr.name_"+name);
    }
    trNode.find(".count").html(num);
}
