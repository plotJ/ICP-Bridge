# ICP Bridge - Cross-Chain Testnet Bridge

ICP Bridge is a decentralized application (dApp) that enables cross-chain transactions between different testnets, deployed on the Internet Computer Protocol (ICP).

## Deployed Canisters

Our project is set up using the custom domain feature of ICP and is viewable at 
https://icpbridge.xyz/

Our project is deployed on the internet at this canister:
https://om6n7-byaaa-aaaag-all2q-cai.icp0.io/


## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.0.0 or later)
- [npm](https://www.npmjs.com/) (version 7.0.0 or later)
- [dfx](https://internetcomputer.org/docs/current/developer-tools/dfx-installation) (DFINITY Canister SDK)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/PlotJ/icp-bridge.git
   cd icp-bridge
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Deployment

1. Start the local Internet Computer replica:
   ```
   dfx start --background
   ```

2. Deploy the canisters:
   ```
   dfx deploy
   ```

3. Once deployed, you'll see URLs for accessing your frontend and backend canisters. The frontend URL will look something like:
   ```
   http://localhost:4943/?canisterId=<canister-id>
   ```

## Development

To run the frontend in development mode:

1. Navigate to the frontend directory:
   ```
   cd src/a11_frontend
   ```

2. Start the development server:
   ```
   npm start
   ```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Building for Production

To build the frontend for production:

1. In the project root, run:
   ```
   dfx build
   ```

2. Deploy the built assets:
   ```
   dfx deploy
   ```

## Project Structure

- `/src/a11_backend`: Contains the backend canister code
- `/src/a11_frontend`: Contains the React frontend application
- `dfx.json`: Configuration file for the Internet Computer project

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your chosen license here]

## Acknowledgements

This project was created as part of ICP Chain Fusion Bali @ Coinfest Asia. Special thanks to all of our amazing mentors and sponsors.
