// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol"; // Optionnel: pour le débogage avec console.log pendant les tests Hardhat

/// @title Voting - simple poll-based voting contract
contract Voting {
    struct Poll {
        string question;
        string[] options;
        uint[] votes;
        uint deadline; // Timestamp de la fin du vote
        address owner;   // Créateur du sondage
    }

    uint public pollCount; // Compteur pour les IDs de sondage uniques
    mapping(uint => Poll) public polls; // Stocke les sondages par ID
    mapping(uint => mapping(address => bool)) public voted; // Track si une adresse a voté pour un sondage (pollId => address => aVoté?)

    event PollCreated(uint pollId, string question, string[] options, uint deadline, address owner);
    event Voted(uint pollId, address voter, uint optionIndex);

    /// @notice Crée un nouveau sondage.
    /// @param q La question du sondage.
    /// @param opts Tableau des options de vote (minimum 2).
    /// @param dur Durée du sondage en secondes à partir de maintenant.
    function createPoll(string calldata q, string[] calldata opts, uint dur) external {
        require(opts.length >= 2, "min 2 options");
        require(dur > 0, "duration must be positive");

        // Initialise le tableau des votes pour le nouveau sondage.
        // La taille du tableau des votes doit correspondre au nombre d'options, avec chaque compteur à 0.
        uint[] memory initialVotes = new uint[](opts.length);
        // Tous les éléments sont initialisés à 0 par défaut, donc pas besoin de boucle explicite.

        // Calcule la deadline
        uint pollDeadline = block.timestamp + dur;

        // TODO: initialise struct and store in mapping
        polls[pollCount] = Poll({
            question: q,
            options: opts,
            votes: initialVotes,
            deadline: pollDeadline,
            owner: msg.sender
        });

        emit PollCreated(pollCount, q, opts, pollDeadline, msg.sender);
        pollCount++;
    }

    /// @notice Permet à un utilisateur de voter dans un sondage spécifique.
    /// @param id ID du sondage.
    /// @param opt Index de l'option choisie.
    function vote(uint id, uint opt) external {
        // Récupérer le sondage depuis le mapping pour faciliter l'accès et la lisibilité
        // Utiliser 'storage' car nous allons modifier l'état du sondage (ses votes)
        Poll storage currentPoll = polls[id];

        // TODO: implement guards (deadline, double-vote, option bounds)
        require(id < pollCount, "Poll does not exist"); // Vérifie que le sondage existe
        require(block.timestamp < currentPoll.deadline, "Voting for this poll is closed");
        require(!voted[id][msg.sender], "You have already voted in this poll");
        require(opt < currentPoll.options.length, "Invalid option index");

        // TODO: record vote & emit event
        voted[id][msg.sender] = true;
        currentPoll.votes[opt]++;
        emit Voted(id, msg.sender, opt);
    }

    /// @notice Récupère les résultats (nombre de votes par option) pour un sondage.
    /// @param id ID du sondage.
    /// @return Tableau des votes.
    function getResults(uint id) external view returns (uint[] memory) {
        require(id < pollCount, "Poll does not exist"); // S'assurer que le sondage existe
        return polls[id].votes;
    }

    // Fonction utilitaire (optionnelle) pour obtenir les détails complets d'un sondage
    function getPollDetails(uint id) external view returns (string memory question, string[] memory options, uint deadline, address owner) {
        require(id < pollCount, "Poll does not exist");
        Poll storage p = polls[id];
        return (p.question, p.options, p.deadline, p.owner);
    }
}
