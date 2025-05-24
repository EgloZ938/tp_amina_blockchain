
# 🗳️ DApp Voting - Projet Blockchain

Ce projet est une application de vote décentralisée (DApp) construite avec Solidity, déployée sur le testnet Sepolia, et accessible via une interface web connectée à MetaMask.

---

## 📚 Sommaire

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Utilisation de la DApp](#-utilisation-de-la-dapp)
- [Structure du projet](#-structure-du-projet)
- [Démonstration vidéo](#-démonstration-vidéo)
- [Auteur](#-auteur)

---

## 📖 Présentation

Cette DApp permet à tout utilisateur possédant un wallet Ethereum compatible (comme MetaMask) de :

- Créer un sondage avec une question et deux options
- Voter pour l'une des options
- Voir les résultats en temps réel
- Toutes les actions sont enregistrées **on-chain** sur Ethereum (testnet Sepolia)

---

## ✨ Fonctionnalités

- ✅ Connexion via MetaMask
- ✅ Création de sondage
- ✅ Vote unique par utilisateur
- ✅ Système de délai automatique (sondage valide pendant 1h)
- ✅ Affichage des résultats
- ✅ Sécurité assurée par le smart contract (aucune double participation possible)

---

## 🛠️ Technologies utilisées

| Outil / Langage     | Usage                                      |
|---------------------|---------------------------------------------|
| Solidity            | Développement du smart contract             |
| Hardhat             | Compilation, test, déploiement              |
| Sepolia Testnet     | Hébergement du contrat                      |
| MetaMask            | Connexion wallet utilisateur                |
| Web3.js             | Interaction JS ↔️ Ethereum                   |
| HTML / JS / CSS     | Interface utilisateur simple et responsive  |
| OBS Studio          | Capture de la démonstration                 |

---

## 🚀 Installation

### Prérequis :

- Node.js
- MetaMask (navigateur)
- Ubuntu ou Windows
- OBS (pour la capture vidéo)

### Clonage du projet :

```bash
git clone https://github.com/TON_UTILISATEUR/voting-dapp.git
cd voting-dapp
```

### Installation des dépendances :

```bash
npm install
```

### Compilation des contrats :

```bash
npx hardhat compile
```

---

## 🌍 Déploiement sur Sepolia

1. Créer un fichier `.env` à la racine :
```
SEPOLIA_URL=https://sepolia.infura.io/v3/TON_TOKEN
PRIVATE_KEY=0xTA_CLE_PRIVÉE
```

2. Déployer le contrat :
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Copier l'adresse du contrat et la coller dans `frontend-lite/config.js`

---

## 🧪 Utilisation de la DApp

1. Lancer l'interface :
```bash
cd frontend-lite
npx live-server .
```

2. Ouvrir MetaMask et se connecter au réseau **Sepolia**

3. Fonctionnalités disponibles :
   - Se connecter au wallet
   - Créer un sondage
   - Voter
   - Afficher les résultats

---

## 📁 Structure du projet

```
.
├── contracts/
│   └── Voting.sol             # Smart contract principal
├── scripts/
│   └── deploy.js              # Script de déploiement
├── test/
│   └── voting.test.js         # Tests automatisés (Hardhat + Chai)
├── frontend-lite/
│   ├── index.html             # Interface web utilisateur
│   └── config.js              # ABI + Adresse du contrat
├── .env                       # Clé privée + URL RPC (à ne pas versionner)
└── README.md                  # Ce fichier
```

---

## 🎥 Démonstration vidéo

📺 La démonstration est disponible ici :

👉 [Lien vers la vidéo de démonstration](https://www.youtube.com/watch?v=6yGek-r0qsA)

---

## 👨‍💻 Auteur

- **Nom :** Théo EVON - Médy DANIEL
- **Date :** Mai 2025

---

## 🔒 Sécurité

- Le contrat empêche :
  - les votes après expiration
  - les votes multiples
  - les sondages invalides (durée nulle, 1 seule option, etc.)

- Le système est entièrement **décentralisé et transparent**, chaque action est visible sur Etherscan et l'extension Metamask
