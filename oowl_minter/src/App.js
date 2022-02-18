import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import reactDom from "react-dom";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 15px;
  border-radius: 3px;
  border: none;
  background-color: var(--primary);
  font-weight: bold;
  color: var(--secondary-text);
  width: 200px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Whoo, the ${CONFIG.NFT_NAME} is yours! Go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
    flex={1}
    ai={"center"}
    style={{ padding: 35,fontFamily: "coder !important", backgroundImage:"/config/images/bg.gif",background: "linear-gradient(#403030, #05111c, #000000)"}}
  >
<s.Container
            flex={2}
            jc={"left"}
            ai={"start"}
            style={{
              padding: 450,
              borderRadius: 24,zIndex:2
            }}image={CONFIG.SHOW_BACKGROUND ? "/config/images/nft-name.png" : null}
          ></s.Container>

  </s.Container>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: "150px 0px",background: "linear-gradient(178deg,#000 100px,#4caf50)",zIndex:3}}
      >
        <a href={CONFIG.MARKETPLACE_LINK}>
         
        </a>
        <s.SpacerSmall />
        <s.Container
  flex={1}
  ai={"center"}
  style={{
    padding:50,
    textAlign: "center",zIndex:0,
  }}image={CONFIG.SHOW_BACKGROUND ? "/config/images/eyes.jpg" : null}
><s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 80,
                padding: 0,
                fontWeight: "bold",
                color: "var(--primary-text)",
                textShadow: "0px 0px 20px black",
              }}
            >
              OWN AN OWL
            </s.TextTitle><s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 80,
                padding: "50px 40%",
                fontWeight: "bold",
                color: "var(--primary)",
                textShadow: "0px 0px 20px black",
              }}
            >
              NOW
            </s.TextTitle></s.Container>
        
        <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              padding: 24,
              borderRadius: 24,
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} of {CONFIG.MAX_SUPPLY} minted
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >
              
            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
         
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
      <s.Container
    flex={1}
    ai={"center"}
    style={{ padding: 150,background: "linear-gradient(5deg,black,brown)",zIndex:3}}
  >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                padding: 100,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >CREATORS</s.TextTitle>
            <s.Container ai={"center"}label="flexDirection"
      values={["column", "row", "row-reverse", "column-reverse"]}>
        <s.Container className="mygrider" style={{ display: "grid", gridGap: 20 }}>
    <s.Container className="mygrid"
            ai={"center"}><s.Container
          flex={2}
            ai={"center"}
            style={{padding:150,backgroundColor: "var(--primary)",width:"150px",height:"150px",boxShadow:"2px 2px 8px black"}}
            image={CONFIG.SHOW_BACKGROUND ? "/config/images/andrei.png" : null}
          ></s.Container>
    <s.TextDescription style={{textAlign: "center",fontSize:35,color: "var(--primary-text)"}}>
  Andrei
</s.TextDescription>
<s.TextDescription style={{textAlign: "center",fontSize:20,color: "var(--primary-text)",flexFlow:"column",}}>Project leader
        <s.SpacerMedium />
</s.TextDescription></s.Container><s.Container className="mygrid"
            ai={"center"}><s.Container
    flex={2}ai={"center"}
            style={{padding:150,backgroundColor: "var(--primary)",width:"150px",height:"150px",boxShadow:"2px 2px 8px black"}}
            image={CONFIG.SHOW_BACKGROUND ? "/config/images/laureen.png" : null}
          ></s.Container>
    <s.TextDescription style={{textAlign: "center",fontSize:35,color: "var(--primary-text)"}}>
      Laureen
</s.TextDescription>
<s.TextDescription style={{textAlign: "center",fontSize:20,color: "var(--primary-text)",flexFlow:"column",}}>
  Designer
</s.TextDescription></s.Container>
<s.Container className="mygrid"
            ai={"center"}><s.Container
          flex={2}
            ai={"center"}
            style={{padding:150,backgroundColor: "var(--primary)",width:"150px",height:"150px",boxShadow:"2px 2px 8px black"}}
            image={CONFIG.SHOW_BACKGROUND ? "/config/images/dan.png" : null}
          ></s.Container>
    <s.TextDescription style={{textAlign: "center",fontSize:35,color: "var(--primary-text)"}}>
  Dan
</s.TextDescription>
<s.TextDescription style={{textAlign: "center",fontSize:25,color: "var(--primary-text)",flexFlow:"column",}}>Programmer
        <s.SpacerMedium />
</s.TextDescription></s.Container>
    
  
  <s.Container 
            ai={"center"}><s.Container
          flex={2}
            ai={"center"}
            style={{padding:150,backgroundColor: "var(--primary)",width:"150px",height:"150px",boxShadow:"2px 2px 8px black"}}
            image={CONFIG.SHOW_BACKGROUND ? "/config/images/alfacocoa.png" : null}
          ></s.Container>
    <s.TextDescription style={{textAlign: "center",fontSize:35,color: "var(--primary-text)"}}>
  AlFaCocoa
</s.TextDescription>
<s.TextDescription style={{textAlign: "center",fontSize:25,color: "var(--primary-text)",flexFlow:"column",}}>Legal advisor
        <s.SpacerMedium />
</s.TextDescription></s.Container>
              </s.Container>
  </s.Container>
</s.Container>
<s.Container
    flex={1}
    ai={"center"}
    style={{ padding: 150, backgroundColor: "var(--primary)",zIndex:3}}
  >
  <s.TextTitle
    style={{
      textAlign: "center",
      fontSize: 50,
      padding:100,
      fontWeight: "bold",
      color: "var(--accent)",
    }}
  >ROADMAP</s.TextTitle>
<s.SpacerMedium />
  <s.TextTitle
    style={{
      textAlign: "center",
      fontSize: 40,
      fontWeight: "bold",
      color: "var(--accent)",
    }}
  >First hoo</s.TextTitle>
  <s.TextDescription
  style={{
    textAlign: "center",
    color: "var(--primary-text)",
    padding: 50,
    width:"100%",
    borderRadius:10,
    backgroundColor: "rgba(255,255,255,0.2)",
  }}>1000 unique randomly generated origami style odd old owls that you can mint on our site. 10 of lucky our odd old owls owners will receive an airdrop of 250 MATIC each( as a simple 10x).
  We use 15% of generated funds to pay our entertainment centre bills so we won't go bankrupt and can continue easily. 50% to open up a new location this summer in another city, we have a working franchise plan.
</s.TextDescription>

<s.TextTitle
    style={{
      textAlign: "center",
      fontSize: 40,
      fontWeight: "bold",
      color: "var(--accent)",
    }}
  >Second hoo</s.TextTitle>
  <s.TextDescription
  style={{
    textAlign: "center",
    color: "var(--primary-text)",
    padding: 50,
    width:"100%",
    borderRadius:10,
    backgroundColor: "rgba(255,255,255,0.2)",
  }}>25% of funds gathered will go to SOS Children's Village in Estonia to give straight back to our local community and spread knowledge of NFT-s. You may hoot more about them at www.sos-lastekyla.ee/en.
</s.TextDescription>

<s.TextTitle
    style={{
      textAlign: "center",
      fontSize: 40,
      fontWeight: "bold",
      color: "var(--accent)",
    }}
  >Third hoo</s.TextTitle>
  <s.TextDescription
  style={{
    textAlign: "center",
    color: "var(--primary-text)",
    padding: 50,
    width:"100%",
    borderRadius:10,
    backgroundColor: "rgba(255,255,255,0.2)",
  }}>Release of our second batch that consists of 1000 junior owls that are put together by our entertainment centre supporters and little fans. Sales from this batch will go for next step of our vision. You can see examples on our team photos. 100 owls will be airdropped to origami odd old owl owners. Our people and entertainment center with our next location will be revealed to only odd old owl owners.
  </s.TextDescription>

<s.TextTitle
    style={{
      textAlign: "center",
      fontSize: 40,
      fontWeight: "bold",
      color: "var(--accent)",
    }}
  >More hoo-hoo-hoo's</s.TextTitle>
  <s.TextDescription
  style={{
    textAlign: "center",
    color: "var(--primary-text)",
    padding: 50,
    width:"100%",
    borderRadius:10,
    backgroundColor: "rgba(255,255,255,0.2)",
  }}>Creation of $MOUSE token - each owl owner NFT will get 5 $MOUSE token per day for five years. Expansion of Odd Old Owls team to create a DAO with our token. 80% of our entertainment centre franchise will be under control of this DAO, profits shall be reinvested into $MOUSE. We have a legal way to achieve it today in Estonia with a vision to go forward. Make your's and our's 2022 count.
  </s.TextDescription>

</s.Container>
<s.Container
    flex={1}
    ai={"center"}
    style={{ padding: 150, backgroundColor: "var(--third)",zIndex:3}}
  >
    <s.TextTitle
    style={{
      textAlign: "center",
      fontSize: 50,
      padding:100,
      fontWeight: "bold",
      color: "var(--primary-text)",
    }}
  >Tokenomics</s.TextTitle>
   
    <s.TextTitle style={{textAlign: "center",fontSize: 30,fontWeight: "bold",color: "var(--primary-text)",}}>
      First batch tokenomics</s.TextTitle>
      <s.Container style={{display:"flex",alignItems:"center",padding:30,}}>
      <svg xmlns="http://www.w3.org/2000/svg" id="sv" width="500px" height="500px" viewBox="0 0 200 200"><path id="0" fill="#ff6025" d="M100, 0 A100,100 0 0 1 199.99999990480705,99.99563667687141 L100,100 A0,0 0 0 0 100,100 Z"></path><path id="1" fill="#febf01" d="M199.99999990480705, 99.99563667687141 A100,100 0 0 1 8.567364915279541e-7,100.01308996935258 L100,100 A0,0 0 0 0 100,100 Z"></path><path id="2" fill="#03a9f4" d="M8.567364915279541e-7, 100.01308996935258 A100,100 0 0 1 41.20876748672511,19.107534469704476 L100,100 A0,0 0 0 0 100,100 Z"></path><path id="3" fill="#8bc34a" d="M41.20876748672511, 19.107534469704476 A100,100 0 0 1 99.98254670756873,0.0000015230870928917284 L100,100 A0,0 0 0 0 100,100 Z"></path></svg></s.Container>
      
      <s.Container style={{fontFamily:"ubuntu",alignItems:"center",background:"rgba(255,255,255,0.2)", padding: 30, borderRadius:10,}}>
      <s.TextTitle style={{textAlign: "center",fontSize: 25,fontWeight: "bold",color: "#febf01",}}>
      50% - to open up a new location in another city to grow a community</s.TextTitle> <s.TextTitle style={{textAlign: "center",fontSize: 25,fontWeight: "bold",color: "#ff6025",}}>
      25% - donation to charity to give back to our local community</s.TextTitle><s.TextTitle style={{textAlign: "left",fontSize: 25,fontWeight: "bold",color: "#03a9f4",}}>
      15% - for paying our current debt so we can continue with our vision</s.TextTitle>      <s.TextTitle style={{textAlign: "left",fontSize: 25,fontWeight: "bold",color: "#8bc34a",}}>
      10% - straight back to 10 lucky owl owners to build a community</s.TextTitle>
      </s.Container>
      </s.Container>
<s.Container
    flex={1}
    ai={"center"}
    style={{ padding: 150, backgroundColor: "var(--primary-text)",zIndex:3}}
  >
    <s.TextTitle
    style={{
      textAlign: "center",
      fontSize: 50,
      padding:100,
      fontWeight: "bold",
      color: "var(--accent)",
    }}
  >FAQ</s.TextTitle>
   
    <s.TextTitle style={{textAlign: "center",fontSize: 30,fontWeight: "bold",color: "var(--accent)",}}>
      Why do we do it?</s.TextTitle>
  <s.TextDescription
  style={{textAlign: "center",color: "var(--accent)",padding: 50,width:"100%",borderRadius:10,backgroundColor: "rgba(0,0,0,0.2)",}}>
    First of all, we have been hit hardly by COVID restrictions and electrical bills being really high this winter, we are 2 months in debt with our bills. Our team has been putting our own money into survival but we can't go on long if restrictions will continue. We got our hopes up with Dastardly Ducks project. We have been into crypto since 2019 and we believe it is our only option to forward since all businesses must change to survive in the future. We are really loved by our customers and it would make us sad if we could not entertain our people anymore. It has always been about experience and great memories. </s.TextDescription>
<s.TextTitle style={{textAlign: "center",fontSize: 30,fontWeight: "bold",color: "var(--accent)",}}>
    Hoo are we?</s.TextTitle>
  <s.TextDescription
  style={{textAlign: "center",color: "var(--accent)",padding: 50,width:"100%",borderRadius:10,backgroundColor: "rgba(0,0,0,0.2)",}}>
    We are a 14 person team of friends and family. Most of us have IT related background. We have been working with our entertainment centre for over 6 years. We offer escape rooms, virtual reality experiences and more. Most of our systems are IOT based, that is why we can work with 1 or 2 employees per location. All software and hardware are made by us.
</s.TextDescription>

<s.TextTitle style={{textAlign: "center",fontSize: 30,fontWeight: "bold",color: "var(--accent)",}}>
      Why owls?</s.TextTitle>
  <s.TextDescription
  style={{textAlign: "center",color: "var(--accent)",padding: 50,width:"100%",borderRadius:10,backgroundColor: "rgba(0,0,0,0.2)",}}>
    Because of the big eyes. We believe those big eyes represent our vision. We also thought about rats because of their maze solving skills. We have a collection of rats ready to roll out with PVP play-to-earn maze game on Solana. Maybe we can bind it together with Odd Old Owls? More of this will be decided with our early investors.</s.TextDescription>

    <s.TextTitle style={{textAlign: "center",fontSize: 30,fontWeight: "bold",color: "var(--accent)",}}>
      Do you wish to be on branches with us?</s.TextTitle>
  <s.TextDescription
  style={{textAlign: "center",color: "var(--accent)",padding: 50,width:"100%",borderRadius:10,backgroundColor: "rgba(0,0,0,0.2)",}}>
    Easiest way is to mint our owls, our first priority is to get our entertainment center on track. This is easily achievable. 
    Maybe you would like to help us with advertising or get on the team? Join our group chat and let's talk!
    </s.TextDescription>

</s.Container>
<s.Container
    flex={1}
    ai={"center"}
    style={{ padding: 150, background: "linear-gradient(#333, #000000)"}}
  >
    <s.TextTitle
    style={{
      textAlign: "center",
      fontSize: 100,
      padding:100,
      fontWeight: "bold",
      color: "var(--accent-text)",
      textShadow: "2px 2px 2px red"
    }}
  >OO</s.TextTitle>
    
    <a href={CONFIG.SCAN_LINK} className="link"
    style={{
      textAlign: "center",
      fontSize: 50,
      padding:10,
      fontWeight: "bold",
      color: "var(--accent)",
    }}
  >CONTRACT</a>
  <a href={CONFIG.MARKETPLACE_LINK} className="link"
    style={{
      textAlign: "center",
      fontSize: 50,
      padding:10,
      fontWeight: "bold",
      color: "var(--accent)",
    }}
  >OPENSEA</a>
      <a href={CONFIG.TWITTER_LINK} className="link"
    style={{
      textAlign: "center",
      fontSize: 50,
      fontWeight: "bold",
      padding:10,
      color: "var(--accent)",
    }}
  >TWITTER</a>
  <a href={CONFIG.DISCORD_LINK} className="link"
    style={{
      textAlign: "center",
      fontSize: 50,
      fontWeight: "bold",
      padding:10,
      color: "var(--accent)",
    }}
  >DISCORD</a>
  
    </s.Container>
    </s.Screen>
  );
}

export default App;
