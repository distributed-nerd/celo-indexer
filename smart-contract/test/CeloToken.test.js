const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CeloToken", function () {
  let celoToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const CeloToken = await ethers.getContractFactory("CeloToken");
    celoToken = await CeloToken.deploy("Celo Token", "CELO", 1000000, 18);
    await celoToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await celoToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await celoToken.balanceOf(owner.address);
      expect(await celoToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct name and symbol", async function () {
      expect(await celoToken.name()).to.equal("Celo Token");
      expect(await celoToken.symbol()).to.equal("CELO");
    });

    it("Should have correct decimals", async function () {
      expect(await celoToken.decimals()).to.equal(18);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await celoToken.transfer(addr1.address, ethers.parseEther("50"));
      const addr1Balance = await celoToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseEther("50"));

      await celoToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
      const addr2Balance = await celoToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.parseEther("50"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await celoToken.balanceOf(owner.address);

      await expect(
        celoToken.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(celoToken, "ERC20InsufficientBalance");

      expect(await celoToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      await celoToken.mint(addr1.address, 100);
      expect(await celoToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(
        celoToken.connect(addr1).mint(addr2.address, 100)
      ).to.be.revertedWithCustomError(celoToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burning", function () {
    it("Should allow token holders to burn their tokens", async function () {
      await celoToken.transfer(addr1.address, ethers.parseEther("100"));
      await celoToken.connect(addr1).burn(ethers.parseEther("50"));
      expect(await celoToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("50"));
    });
  });
});
