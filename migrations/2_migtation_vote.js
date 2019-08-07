
//部署合约 truffle migration --reset
//Voting 是合约的名字在/contracts/Voting.sol
const voting = artifacts.require("Voting");
var safemath = artifacts.require("SafeMath.sol");

//部署的时候，自动获取web3.accounts 中的一个账户部署
module.exports = function(deployer) {
	
	//Rose, Jack
	let pa = [
		str2hex("Rose"), str2hex("Jack"), str2hex("Sam"),
		str2hex("Rob"), str2hex("Cat"), str2hex("Dog"), 
	];
	deployer.deploy(safemath);
	deployer.link(safemath, voting);
	// pa 参数是传给Voting 合约的构造函数的
	deployer.deploy(voting, pa);
};


// 字符串转16进制
function str2hex(str){
	if(str === ""){
	  return "";
	}
	var arr = [];
	arr.push("0x");
	for(var i=0;i<str.length;i++){
	  arr.push(str.charCodeAt(i).toString(16));
	}
	return arr.join('');
}






