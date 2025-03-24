import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatInterface from './ChatInterface';
import Terminal from './Terminal';
import Navbar from './Navbar';
import { KadenaExtension } from "@magic-ext/kadena";
import { addSignatures, ITransactionDescriptor,Pact,createClient } from "@kadena/client";
import { PactNumber } from "@kadena/pactjs";
import {  SignedCommand } from "@magic-ext/kadena/dist/types/types";
import { createMagic } from "./magic";
import { DEFAULT_CHAIN_ID, NETWORK_ID } from "./utils/constants";
import { ChainId, ICommand, IUnsignedCommand } from "@kadena/types";
import { buildTransferCreateTransaction } from "./pact/transfer-create";
import { buildTransferTransaction } from "./pact/transfer";
import { buildTransferCrosschainTransaction } from "./pact/transfer-crosschain";
import { buildTransferContinuationTransaction } from "./pact/transfer-continuation";
import { checkAccountExists } from "./utils/check-account-exists";
import { getBalance } from "./utils/get-balance";
import { accountToPublicKey } from "./utils/account-to-public-key";
import { getKadenaClient } from "./utils/client";
import { Routes, Route, Navigate } from 'react-router-dom';

// Define the type locally
interface KadenaUserMetadata {
  accountName: string;
  publicKey: string;
  loginType: string;
}

interface TerminalOutput {
  type: 'command' | 'output';
  content: string;
}

interface PanelProps {
  visible?: boolean;
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
`;

const Panel = styled.div<PanelProps>`
  flex: 1;
  background-color: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const FullWidthPanel = styled(Panel)`
  flex: 1;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url('/1.png') no-repeat center center fixed;
  background-size: cover;
  color: #f0f0f0;
`;

const LoginCard = styled.div`
  background: url('/container.png') no-repeat center center fixed;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.8rem;
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
`;

const LoginHeader = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  text-align: center;
  color: #ffffff;
  font-weight: 500;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  text-align: center;
  color: #888888;
`;

const LoginInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1.1rem;
  margin: 0.5rem 0;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TransactionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`;

const TransactionButton = styled(LoginButton)`
  width: auto;
`;

const TransactionInput = styled(LoginInput)`
  width: 200px;
  margin: 0;
`;

function App() {
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutput[]>([]);
  const [magic, setMagic] = useState(createMagic());
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<KadenaUserMetadata | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<ChainId>(DEFAULT_CHAIN_ID as ChainId);
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'terminal'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const initAppState = async () => {
      try {
        setIsLoading(true);
        const magicIsLoggedIn = await magic.user.isLoggedIn();
        setIsLoggedIn(magicIsLoggedIn);

        if (magicIsLoggedIn) {
          const user = await getUserInfo();
          setUserInfo(user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    initAppState();
  }, []);

  const handleCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, { type: 'command', content: command }]);
    setTerminalOutput(prev => [...prev, { type: 'output', content: `Executed: ${command}` }]);
  };

  const loginWithEmailOTP = async () => {
    try {
      setIsSubmitting(true);
      await magic.auth.loginWithEmailOTP({ email });
      setIsLoggedIn(true);
      const user = await getUserInfo();
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserInfo = () => {
    return magic.kadena.getUserInfo();
  };
  const handleBuildTransaction = async () => {

    const to = "k:9aad69237d1b850ec8fc5ea5645bccd1a5a36ca752c654cdca2520b6ce99d366";
    const from = userInfo?.accountName as string;
    const amount = new PactNumber(10).toPactDecimal();
    const chainId = selectedChainId;
    const senderPubKey = userInfo?.publicKey as string;
    const receiverPubKey = accountToPublicKey(to);
    const isSpireKeyAccount = Boolean(userInfo?.loginType === "spirekey");
      return buildTransferTransaction({
        to,
        from,
        amount,
        chainId,
        senderPubKey,
        receiverPubKey,
        isSpireKeyAccount,
      });

    return buildTransferCreateTransaction({
      to,
      from,
      amount,
      chainId,
      senderPubKey,
      receiverPubKey,
      isSpireKeyAccount,
    });
  };

  const signTransaction = async (transaction: IUnsignedCommand) => {
    const isSpireKeyLogin = Boolean(userInfo?.loginType === "spirekey");

    if (isSpireKeyLogin) {
      const { transactions } = await magic.kadena.signTransactionWithSpireKey(transaction);
      return transactions[0];
    } else {
      const signature = await magic.kadena.signTransaction(transaction.hash);
      return addSignatures(transaction, signature);
    }
  };

  // Same Chain Transaction
  const handleSendTransaction = async () => {
    if (!userInfo?.accountName) return;

    try {
      const kadenaClient = getKadenaClient(selectedChainId);

      const transaction = await handleBuildTransaction();

      const signedTx = await signTransaction(transaction);
      console.log("signed transaction", signedTx);

      // See if transaction will succeed locally before broadcasting
      const localRes = await kadenaClient.local(signedTx as ICommand);
      if (localRes.result.status === "failure") {
        throw new Error((localRes.result.error as { message: string }).message);
      }

      const transactionDescriptor = await kadenaClient.submit(signedTx as ICommand);
      console.log("broadcasting transaction...", transactionDescriptor);

      const response = await kadenaClient.listen(transactionDescriptor);
      setDisabled(false);

      if (response.result.status === "failure") {
        console.error(response.result.error);
      } else {
        console.log("transaction success! response:", response);
        getBalance(userInfo.accountName, selectedChainId).then(setBalance);
      }
    } catch (error) {
      console.error("Failed to send transaction", error);
      setDisabled(false);
    }
  };

  const handleBuildXTransaction = async () => {
    const to = userInfo?.accountName as string;
    const from = userInfo?.accountName as string;
    const amount = new PactNumber(10).toPactDecimal();
    const toChainId = selectedChainId === "0" ? "1" : "0" as ChainId;
    const fromChainId = selectedChainId;
    const senderPubKey = userInfo?.publicKey as string;
    const receiverPubKey = userInfo?.publicKey as string;
    const isSpireKeyAccount = Boolean(userInfo?.loginType === "spirekey");

    return buildTransferCrosschainTransaction({
      to,
      from,
      amount,
      toChainId,
      fromChainId,
      senderPubKey,
      receiverPubKey,
      isSpireKeyAccount,
    });
  };
  const logout = async () => {
    try {
      await magic.user.logout();
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleView = (view: 'chat' | 'terminal') => {
    setActiveView(view);
  };

  if (isLoading) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginHeader>Loading...</LoginHeader>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <div>
      {!isLoggedIn ? (
        <LoginContainer>
          <LoginCard>
            <Logo src="/Picture.png" alt="Agent K Logo" />
            <LoginHeader>Welcome to Agent K</LoginHeader>
            <Subtitle>Get the latest updates about Kadena ecosystem</Subtitle>
            <LoginInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
            <LoginInput
              type="text"
              placeholder="Enter token name"
              value={tokenName}
              onChange={(event) => setTokenName(event.target.value)}
              disabled={isSubmitting}
            />
            <LoginButton 
              onClick={loginWithEmailOTP} 
              disabled={!email || isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </LoginButton>
          </LoginCard>
        </LoginContainer>
      ) : (
        <AppContainer>
          <Navbar 
            activeView={activeView} 
            onToggleView={handleToggleView} 
            onLogout={logout}
          />
          <TransactionContainer>
            <TransactionInput
              type="text"
              placeholder="Enter token name"
              value={tokenName}
              onChange={(event) => setTokenName(event.target.value)}
            />
            <TransactionButton 
              disabled={disabled} 
              onClick={handleSendTransaction}
            >
              {disabled ? "sending..." : "Send Transaction"}
            </TransactionButton>
          </TransactionContainer>
          <ContentContainer>
            <Routes>
              <Route 
                path="/chat/:agentName" 
                element={<FullWidthPanel visible={true}><ChatInterface onCommand={handleCommand} /></FullWidthPanel>} 
              />
              <Route 
                path="/" 
                element={
                  activeView === 'chat' ? (
                    <FullWidthPanel visible={true}>
                      <ChatInterface onCommand={handleCommand} />
                    </FullWidthPanel>
                  ) : (
                    <FullWidthPanel visible={true}>
                      <Terminal selectedAgent={38} />
                    </FullWidthPanel>
                  )
                } 
              />
            </Routes>
          </ContentContainer>
        </AppContainer>
      )}
    </div>
  );
}

export default App; 