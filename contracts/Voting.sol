pragma solidity ^0.5.0;
//pragma experimental ABIEncoderV2;
import "./SafeMath.sol";
contract Voting {
    using SafeMath for uint;
    //候选人被投的票数
    mapping(bytes32 => uint) public votesReceived;
    //用户是否已经投过了
    mapping(address => bool) public userVoted;
    //候选人
    bytes32[] public candidateList;
    //构造函数 部署的时候传递
    constructor(bytes32[] memory c) public {
        //candidateList = [bytes32("test1"), bytes32("test2")];
        candidateList = c;
    }
    function test() public pure returns (string memory){
        return "hello, 这是投票合约test";
    }
    //某个候选人总票数
    function getTotalByCandidate(bytes32 candidate) public view returns(uint){
        require(validCandidate(candidate), "获取投票数量失败：无效的候选人!");
        return votesReceived[candidate];
    }
    //为某个候选人投票
    function voteForCandidate(bytes32 candidate) public payable{
        require(validCandidate(candidate), "投票失败：无效的候选人");
        // 为了便于测试，一人一票这个限制放开
        /*if (userVoted[msg.sender] == true) {
            require(false, "你已经投过票了");
        }*/
        //投票要花钱
        require(msg.value == 0.1 ether, "投票一次要花费0.1 ether!");
        votesReceived[candidate] = votesReceived[candidate].add(1);
        userVoted[msg.sender] = true;
    }
    //获取候选人
    function getCandidates() public view returns(bytes32[] memory) {
        return candidateList;
    }
    //验证投的候选人是否是合法的
    function validCandidate(bytes32 candidate) private view returns(bool){
        for (uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
}
