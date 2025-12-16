// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * NeuralBrain
 * 
 * Smart contract for distributed AI reasoning and consensus
 * Part of the AICouncil blockchain neural integration
 */

contract NeuralBrain {
    
    // ============ Structures ============
    
    struct NeuronState {
        bytes32 agentId;
        bytes32 currentThought;      // IPFS hash of reasoning
        uint256 confidence;          // 0-1e18 (wei scale)
        uint256 timestamp;
        bool active;
    }
    
    struct Synapse {
        bytes32 fromAgent;
        bytes32 toAgent;
        bytes32 messageHash;         // IPFS hash of exchange
        uint256 weight;              // 0-1e18 (influence score)
        uint256 timestamp;
    }
    
    struct ConsensusRound {
        uint256 roundId;
        bytes32 topic;
        bytes32[] agentVotes;        // IPFS hashes
        uint256 consensusScore;      // 0-1e18
        bool finalized;
        uint256 createdAt;
        uint256 finalizedAt;
    }
    
    struct Agent {
        address controller;          // Wallet operating this agent
        bytes32 modelHash;           // IPFS hash of model weights
        uint256 reputation;          // Consensus accuracy score
        uint256 participationCount;
        uint256 lastActive;
        bool active;
    }
    
    // ============ State ============
    
    mapping(bytes32 => NeuronState) public neurons;
    mapping(bytes32 => Synapse[]) public synapses;  // from agent -> to agent
    mapping(uint256 => ConsensusRound) public consensusRounds;
    mapping(bytes32 => Agent) public agents;
    
    bytes32[] public agentRegistry;
    uint256 public nextRoundId;
    
    address public admin;
    uint256 public consensusThreshold = 5e17;  // 0.5 (50%)
    
    // ============ Events ============
    
    event NeuralActivity(
        bytes32 indexed agentId,
        bytes32 indexed thought,
        uint256 confidence,
        uint256 timestamp
    );
    
    event SynapseFormed(
        bytes32 indexed fromAgent,
        bytes32 indexed toAgent,
        uint256 weight,
        uint256 timestamp
    );
    
    event ConsensusRoundCreated(
        uint256 indexed roundId,
        bytes32 indexed topic,
        uint256 timestamp
    );
    
    event ConsensusFinalized(
        uint256 indexed roundId,
        uint256 consensusScore,
        bool consensusReached,
        uint256 timestamp
    );
    
    event AgentRegistered(
        bytes32 indexed agentId,
        address indexed controller,
        uint256 timestamp
    );
    
    event AgentDeactivated(
        bytes32 indexed agentId,
        uint256 timestamp
    );
    
    // ============ Modifiers ============
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier agentMustExist(bytes32 agentId) {
        require(agents[agentId].active, "Agent does not exist");
        _;
    }
    
    modifier roundMustExist(uint256 roundId) {
        require(
            consensusRounds[roundId].createdAt > 0,
            "Round does not exist"
        );
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        admin = msg.sender;
        nextRoundId = 1;
    }
    
    // ============ Agent Registration ============
    
    /**
     * Register a new AI agent
     */
    function registerAgent(
        bytes32 agentId,
        bytes32 modelHash
    ) external {
        require(!agents[agentId].active, "Agent already registered");
        require(agentId != 0, "Invalid agent ID");
        
        Agent storage agent = agents[agentId];
        agent.controller = msg.sender;
        agent.modelHash = modelHash;
        agent.reputation = 1e18;  // Start with 100%
        agent.active = true;
        agent.participationCount = 0;
        agent.lastActive = block.timestamp;
        
        agentRegistry.push(agentId);
        
        emit AgentRegistered(agentId, msg.sender, block.timestamp);
    }
    
    /**
     * Deactivate an agent
     */
    function deactivateAgent(bytes32 agentId) external onlyAdmin {
        require(agents[agentId].active, "Agent not active");
        agents[agentId].active = false;
        emit AgentDeactivated(agentId, block.timestamp);
    }
    
    // ============ Neural Activity ============
    
    /**
     * Record neural activity (agent thinking)
     */
    function recordNeuralActivity(
        bytes32 agentId,
        bytes32 thoughtHash,
        uint256 confidence
    ) external agentMustExist(agentId) {
        require(thoughtHash != 0, "Invalid thought hash");
        require(confidence <= 1e18, "Confidence out of range");
        
        NeuronState storage neuron = neurons[agentId];
        neuron.agentId = agentId;
        neuron.currentThought = thoughtHash;
        neuron.confidence = confidence;
        neuron.timestamp = block.timestamp;
        neuron.active = true;
        
        agents[agentId].lastActive = block.timestamp;
        
        emit NeuralActivity(
            agentId,
            thoughtHash,
            confidence,
            block.timestamp
        );
    }
    
    /**
     * Form synapse between agents (influence connection)
     */
    function formSynapse(
        bytes32 fromAgent,
        bytes32 toAgent,
        bytes32 messageHash,
        uint256 weight
    ) external agentMustExist(fromAgent) {
        require(agents[toAgent].active, "Target agent not active");
        require(weight <= 1e18, "Weight out of range");
        require(fromAgent != toAgent, "Cannot synapse with self");
        
        Synapse memory synapse = Synapse({
            fromAgent: fromAgent,
            toAgent: toAgent,
            messageHash: messageHash,
            weight: weight,
            timestamp: block.timestamp
        });
        
        synapses[fromAgent].push(synapse);
        
        emit SynapseFormed(
            fromAgent,
            toAgent,
            weight,
            block.timestamp
        );
    }
    
    // ============ Consensus ============
    
    /**
     * Create a new consensus round
     */
    function createConsensusRound(bytes32 topic)
        external
        returns (uint256)
    {
        require(topic != 0, "Invalid topic");
        
        uint256 roundId = nextRoundId;
        nextRoundId++;
        
        ConsensusRound storage round = consensusRounds[roundId];
        round.roundId = roundId;
        round.topic = topic;
        round.createdAt = block.timestamp;
        round.finalized = false;
        
        emit ConsensusRoundCreated(roundId, topic, block.timestamp);
        
        return roundId;
    }
    
    /**
     * Record votes in a consensus round
     */
    function recordConsensusVotes(
        uint256 roundId,
        bytes32[] calldata voteHashes
    ) external roundMustExist(roundId) {
        ConsensusRound storage round = consensusRounds[roundId];
        require(!round.finalized, "Round already finalized");
        
        round.agentVotes = voteHashes;
    }
    
    /**
     * Finalize consensus round
     */
    function finalizeConsensusRound(
        uint256 roundId,
        uint256 consensusScore
    ) external roundMustExist(roundId) {
        require(!consensusRounds[roundId].finalized, "Already finalized");
        require(
            consensusScore <= 1e18,
            "Score out of range"
        );
        
        ConsensusRound storage round = consensusRounds[roundId];
        round.consensusScore = consensusScore;
        round.finalized = true;
        round.finalizedAt = block.timestamp;
        
        bool consensusReached = consensusScore >= consensusThreshold;
        
        // Update participating agent reputations
        // (In production: score based on prediction accuracy)
        if (consensusReached) {
            for (uint i = 0; i < agentRegistry.length; i++) {
                bytes32 agentId = agentRegistry[i];
                if (agents[agentId].lastActive >= round.createdAt) {
                    agents[agentId].reputation = 
                        (agents[agentId].reputation * 105) / 100;  // +5%
                    agents[agentId].participationCount++;
                }
            }
        }
        
        emit ConsensusFinalized(
            roundId,
            consensusScore,
            consensusReached,
            block.timestamp
        );
    }
    
    // ============ Queries ============
    
    /**
     * Get agent count
     */
    function getAgentCount() external view returns (uint256) {
        return agentRegistry.length;
    }
    
    /**
     * Get all agents
     */
    function getAllAgents() external view returns (bytes32[] memory) {
        return agentRegistry;
    }
    
    /**
     * Get agent details
     */
    function getAgent(bytes32 agentId)
        external
        view
        returns (Agent memory)
    {
        return agents[agentId];
    }
    
    /**
     * Get neuron state
     */
    function getNeuronState(bytes32 agentId)
        external
        view
        returns (NeuronState memory)
    {
        return neurons[agentId];
    }
    
    /**
     * Get synapses from an agent
     */
    function getSynapses(bytes32 fromAgent)
        external
        view
        returns (Synapse[] memory)
    {
        return synapses[fromAgent];
    }
    
    /**
     * Get consensus round
     */
    function getConsensusRound(uint256 roundId)
        external
        view
        returns (ConsensusRound memory)
    {
        return consensusRounds[roundId];
    }
    
    // ============ Admin ============
    
    /**
     * Update consensus threshold
     */
    function setConsensusThreshold(uint256 newThreshold)
        external
        onlyAdmin
    {
        require(newThreshold <= 1e18, "Invalid threshold");
        consensusThreshold = newThreshold;
    }
    
    /**
     * Transfer admin role
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
    }
}
