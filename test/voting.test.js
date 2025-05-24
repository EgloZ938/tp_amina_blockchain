// Importer les dépendances nécessaires depuis Chai et Hardhat
const { expect } = require("chai");
const { ethers, network } = require("hardhat");

// Décrire la suite de tests pour le contrat Voting
describe("Voting Contract Tests", function () {
    // Déclarer les variables qui seront utilisées dans les tests
    let Voting; // Le factory du contrat
    let votingContract; // L'instance déployée du contrat
    let owner; // Le propriétaire du contrat (premier signataire)
    let addr1; // Un autre compte pour les tests
    let addr2; // Encore un autre compte
    let addrs; // Tableau des autres comptes

    const pollQuestion = "Quelle est votre couleur préférée ?";
    const pollOptions = ["Rouge", "Vert", "Bleu"];
    const pollDuration = 3600; // 1 heure en secondes

    // Avant chaque test (`it`), redéployer le contrat pour un environnement propre
    beforeEach(async function () {
        // Obtenir le factory du contrat
        Voting = await ethers.getContractFactory("Voting");
        // Obtenir les signataires (comptes)
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        // Déployer une nouvelle instance du contrat
        votingContract = await Voting.deploy();
        // Attendre que le contrat soit déployé (bien que `deploy()` attende déjà)
        // await votingContract.deployed(); // Note: `deployed()` est souvent redondant avec ethers.js v5+
    });

    // Suite de tests pour le déploiement du contrat
    describe("Deployment", function () {
        it("Should have pollCount initialized to 0", async function () {
            // Vérifier que pollCount est bien 0 au déploiement
            expect(await votingContract.pollCount()).to.equal(0);
        });
    });

    // Suite de tests pour la création de sondages
    describe("Poll Creation (createPoll)", function () {
        it("Should allow a user to create a valid poll", async function () {
            const initialPollCount = await votingContract.pollCount(); // Devrait être 0

            // Simuler l'appel à createPoll
            const tx = await votingContract.connect(owner).createPoll(pollQuestion, pollOptions, pollDuration);
            const receipt = await tx.wait(); // Attendre la confirmation de la transaction

            // Vérifier l'émission de l'événement PollCreated
            // Trouver l'événement dans les logs de la transaction
            const event = receipt.events?.find(e => e.event === 'PollCreated');
            expect(event).to.not.be.undefined;
            expect(event.args.pollId).to.equal(initialPollCount);
            expect(event.args.question).to.equal(pollQuestion);
            expect(event.args.options).to.deep.equal(pollOptions); // Comparaison profonde pour les tableaux
            const expectedDeadline = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp + pollDuration;
            expect(event.args.deadline).to.equal(expectedDeadline);
            expect(event.args.owner).to.equal(owner.address);

            // Vérifier que pollCount a été incrémenté
            expect(await votingContract.pollCount()).to.equal(initialPollCount.add(1));

            // Vérifier que les détails du sondage sont correctement stockés
            const poll = await votingContract.polls(initialPollCount);
            expect(poll.question).to.equal(pollQuestion);
            expect(poll.options.length).to.equal(pollOptions.length);
            for (let i = 0; i < pollOptions.length; i++) {
                expect(poll.options[i]).to.equal(pollOptions[i]);
            }
            expect(poll.votes.length).to.equal(pollOptions.length); // Le tableau des votes doit avoir la bonne taille
            poll.votes.forEach(voteCount => expect(voteCount).to.equal(0)); // Tous les votes à 0
            expect(poll.deadline).to.equal(expectedDeadline);
            expect(poll.owner).to.equal(owner.address);
        });

        it("Should revert if less than 2 options are provided", async function () {
            await expect(
                votingContract.connect(owner).createPoll("Question?", ["Option Unique"], pollDuration)
            ).to.be.revertedWith("min 2 options");
        });

        it("Should revert if duration is zero or negative", async function () {
            // Test avec une durée de 0
            await expect(
                votingContract.connect(owner).createPoll(pollQuestion, pollOptions, 0)
            ).to.be.revertedWith("duration must be positive");
        });
    });

    // Suite de tests pour la fonction de vote
    describe("Voting (vote)", function () {
        let pollId;

        // Avant chaque test de vote, créer un sondage
        beforeEach(async function () {
            pollId = await votingContract.pollCount(); // Sera 0 pour le premier sondage créé
            await votingContract.connect(owner).createPoll(pollQuestion, pollOptions, pollDuration);
        });

        it("Should allow a user to vote on a valid poll and option", async function () {
            const optionToVote = 1; // Voter pour "Vert"

            // Simuler le vote
            await expect(votingContract.connect(addr1).vote(pollId, optionToVote))
                .to.emit(votingContract, "Voted")
                .withArgs(pollId, addr1.address, optionToVote);

            // Vérifier que le vote a été enregistré
            const poll = await votingContract.polls(pollId);
            expect(poll.votes[optionToVote]).to.equal(1);

            // Vérifier que l'état 'voted' est mis à jour
            expect(await votingContract.voted(pollId, addr1.address)).to.be.true;
        });

        it("Should revert if poll ID does not exist", async function () {
            const nonExistentPollId = 99;
            await expect(
                votingContract.connect(addr1).vote(nonExistentPollId, 0)
            ).to.be.revertedWith("Poll does not exist");
        });

        it("Should revert if voting after the deadline", async function () {
            // Avancer le temps du réseau Hardhat au-delà de la deadline
            await network.provider.send("evm_increaseTime", [pollDuration + 60]); // Avance de pollDuration + 60 secondes
            await network.provider.send("evm_mine"); // Miner un nouveau bloc pour que le changement de temps prenne effet

            await expect(
                votingContract.connect(addr1).vote(pollId, 0)
            ).to.be.revertedWith("Voting for this poll is closed");
        });

        it("Should revert if a user tries to vote twice on the same poll", async function () {
            await votingContract.connect(addr1).vote(pollId, 0); // Premier vote
            await expect(
                votingContract.connect(addr1).vote(pollId, 1) // Tentative de second vote
            ).to.be.revertedWith("You have already voted in this poll");
        });

        it("Should revert if the option index is out of bounds", async function () {
            const invalidOptionIndex = pollOptions.length; // Index juste après la dernière option valide
            await expect(
                votingContract.connect(addr1).vote(pollId, invalidOptionIndex)
            ).to.be.revertedWith("Invalid option index");

            // Tester également avec un index négatif (bien que uint ne puisse pas être négatif,
            // une très grande valeur pourrait causer des problèmes si non gérée, mais Solidity gère cela)
            // Pour être sûr, on peut tester avec un index explicitement trop grand.
        });
    });

    // Suite de tests pour la récupération des résultats
    describe("Getting Results (getResults)", function () {
        let pollId;

        beforeEach(async function () {
            pollId = await votingContract.pollCount();
            await votingContract.connect(owner).createPoll(pollQuestion, pollOptions, pollDuration);
            // Faire voter quelques utilisateurs
            await votingContract.connect(addr1).vote(pollId, 0); // addr1 vote pour Rouge
            await votingContract.connect(addr2).vote(pollId, 1); // addr2 vote pour Vert
            await votingContract.connect(addrs[0]).vote(pollId, 0); // addrs[0] vote pour Rouge
        });

        it("Should return the correct vote counts for a poll", async function () {
            const results = await votingContract.getResults(pollId);
            expect(results.length).to.equal(pollOptions.length);
            expect(results[0]).to.equal(2); // 2 votes pour Rouge
            expect(results[1]).to.equal(1); // 1 vote pour Vert
            expect(results[2]).to.equal(0); // 0 vote pour Bleu
        });

        it("Should revert if trying to get results for a non-existent poll", async function () {
            const nonExistentPollId = 99;
            await expect(
                votingContract.getResults(nonExistentPollId)
            ).to.be.revertedWith("Poll does not exist");
        });
    });

    // Suite de tests pour la fonction getPollDetails (fonction utilitaire)
    describe("Getting Poll Details (getPollDetails)", function () {
        let pollId;
        let expectedDeadline;

        beforeEach(async function () {
            pollId = await votingContract.pollCount();
            const tx = await votingContract.connect(owner).createPoll(pollQuestion, pollOptions, pollDuration);
            const receipt = await tx.wait();
            expectedDeadline = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp + pollDuration;
        });

        it("Should return correct details for an existing poll", async function () {
            const details = await votingContract.getPollDetails(pollId);
            // details est un tableau: [question, options, deadline, owner]
            expect(details[0]).to.equal(pollQuestion); // question
            expect(details[1]).to.deep.equal(pollOptions); // options
            expect(details[2]).to.equal(expectedDeadline); // deadline
            expect(details[3]).to.equal(owner.address); // owner
        });

        it("Should revert if trying to get details for a non-existent poll", async function () {
            const nonExistentPollId = 99;
            await expect(
                votingContract.getPollDetails(nonExistentPollId)
            ).to.be.revertedWith("Poll does not exist");
        });
    });
});
