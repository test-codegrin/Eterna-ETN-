import { expect } from "chai";
import { ethers } from "hardhat";
import { Eterna } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Eterna Token", function () {
  const INITIAL_SUPPLY = 1000000;
  const DECIMALS = 18;

  async function deployEternaFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const EternaFactory = await ethers.getContractFactory("Eterna");
    const eterna = await EternaFactory.deploy(INITIAL_SUPPLY);
    await eterna.waitForDeployment();

    return { eterna, owner, addr1, addr2, addr3 };
  }

  describe("Deployment", function () {
    it("Should deploy with correct name and symbol", async function () {
      const { eterna } = await loadFixture(deployEternaFixture);

      expect(await eterna.name()).to.equal("Eterna");
      expect(await eterna.symbol()).to.equal("ETN");
    });

    it("Should have 18 decimals", async function () {
      const { eterna } = await loadFixture(deployEternaFixture);

      expect(await eterna.decimals()).to.equal(DECIMALS);
    });

    it("Should mint initial supply to owner", async function () {
      const { eterna, owner } = await loadFixture(deployEternaFixture);

      const expectedSupply = ethers.parseUnits(INITIAL_SUPPLY.toString(), DECIMALS);
      expect(await eterna.totalSupply()).to.equal(expectedSupply);
      expect(await eterna.balanceOf(owner.address)).to.equal(expectedSupply);
    });

    it("Should emit TokensMinted event on deployment", async function () {
      const [owner] = await ethers.getSigners();
      const EternaFactory = await ethers.getContractFactory("Eterna");

      const expectedAmount = ethers.parseUnits(INITIAL_SUPPLY.toString(), DECIMALS);
      const eterna = await EternaFactory.deploy(INITIAL_SUPPLY);

      await expect(eterna.deploymentTransaction())
        .to.emit(eterna, "TokensMinted")
        .withArgs(owner.address, expectedAmount);
    });

    it("Should fail deployment with zero initial supply", async function () {
      const EternaFactory = await ethers.getContractFactory("Eterna");

      await expect(EternaFactory.deploy(0))
        .to.be.revertedWith("Eterna: initial supply must be greater than 0");
    });

    it("Should set deployer as owner", async function () {
      const { eterna, owner } = await loadFixture(deployEternaFixture);

      expect(await eterna.owner()).to.equal(owner.address);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const transferAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.transfer(addr1.address, transferAmount))
        .to.changeTokenBalances(eterna, [owner, addr1], [-transferAmount, transferAmount]);
    });

    it("Should emit Transfer event", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const transferAmount = ethers.parseUnits("50", DECIMALS);
      await expect(eterna.transfer(addr1.address, transferAmount))
        .to.emit(eterna, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });

    it("Should fail transfer to zero address", async function () {
      const { eterna } = await loadFixture(deployEternaFixture);

      const transferAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.transfer(ethers.ZeroAddress, transferAmount))
        .to.be.revertedWith("Eterna: cannot transfer to zero address");
    });

    it("Should fail transfer with insufficient balance", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const ownerBalance = await eterna.balanceOf(owner.address);
      const excessAmount = ownerBalance + ethers.parseUnits("1", DECIMALS);

      await expect(eterna.transfer(addr1.address, excessAmount))
        .to.be.revertedWith("Eterna: insufficient balance");
    });

    it("Should fail transfer with zero amount", async function () {
      const { eterna, addr1 } = await loadFixture(deployEternaFixture);

      await expect(eterna.transfer(addr1.address, 0))
        .to.be.revertedWith("Eterna: transfer amount must be greater than 0");
    });

    it("Should handle multiple transfers correctly", async function () {
      const { eterna, owner, addr1, addr2 } = await loadFixture(deployEternaFixture);

      const amount1 = ethers.parseUnits("100", DECIMALS);
      const amount2 = ethers.parseUnits("50", DECIMALS);

      await eterna.transfer(addr1.address, amount1);
      await eterna.transfer(addr2.address, amount2);

      expect(await eterna.balanceOf(addr1.address)).to.equal(amount1);
      expect(await eterna.balanceOf(addr2.address)).to.equal(amount2);
    });
  });

  describe("Approvals and TransferFrom", function () {
    it("Should approve tokens for delegation", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const approvalAmount = ethers.parseUnits("200", DECIMALS);
      await expect(eterna.approve(addr1.address, approvalAmount))
        .to.emit(eterna, "Approval")
        .withArgs(owner.address, addr1.address, approvalAmount);

      expect(await eterna.allowance(owner.address, addr1.address)).to.equal(approvalAmount);
    });

    it("Should allow transferFrom with proper approval", async function () {
      const { eterna, owner, addr1, addr2 } = await loadFixture(deployEternaFixture);

      const approvalAmount = ethers.parseUnits("300", DECIMALS);
      const transferAmount = ethers.parseUnits("150", DECIMALS);

      await eterna.approve(addr1.address, approvalAmount);

      await expect(eterna.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount))
        .to.changeTokenBalances(eterna, [owner, addr2], [-transferAmount, transferAmount]);

      expect(await eterna.allowance(owner.address, addr1.address))
        .to.equal(approvalAmount - transferAmount);
    });

    it("Should fail transferFrom without approval", async function () {
      const { eterna, owner, addr1, addr2 } = await loadFixture(deployEternaFixture);

      const transferAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount))
        .to.be.reverted;
    });

    it("Should fail transferFrom with insufficient allowance", async function () {
      const { eterna, owner, addr1, addr2 } = await loadFixture(deployEternaFixture);

      const approvalAmount = ethers.parseUnits("50", DECIMALS);
      const transferAmount = ethers.parseUnits("100", DECIMALS);

      await eterna.approve(addr1.address, approvalAmount);

      await expect(eterna.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount))
        .to.be.reverted;
    });

    it("Should fail transferFrom to zero address", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const amount = ethers.parseUnits("100", DECIMALS);
      await eterna.approve(addr1.address, amount);

      await expect(eterna.connect(addr1).transferFrom(owner.address, ethers.ZeroAddress, amount))
        .to.be.revertedWith("Eterna: cannot transfer to zero address");
    });

    it("Should fail transferFrom from zero address", async function () {
      const { eterna, addr1 } = await loadFixture(deployEternaFixture);

      const amount = ethers.parseUnits("100", DECIMALS);

      await expect(eterna.transferFrom(ethers.ZeroAddress, addr1.address, amount))
        .to.be.revertedWith("Eterna: cannot transfer from zero address");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const mintAmount = ethers.parseUnits("500", DECIMALS);
      const initialSupply = await eterna.totalSupply();

      await expect(eterna.mint(addr1.address, mintAmount))
        .to.emit(eterna, "TokensMinted")
        .withArgs(addr1.address, mintAmount);

      expect(await eterna.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await eterna.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should fail minting by non-owner", async function () {
      const { eterna, addr1, addr2 } = await loadFixture(deployEternaFixture);

      const mintAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.connect(addr1).mint(addr2.address, mintAmount))
        .to.be.revertedWithCustomError(eterna, "OwnableUnauthorizedAccount");
    });

    it("Should fail minting to zero address", async function () {
      const { eterna } = await loadFixture(deployEternaFixture);

      const mintAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.mint(ethers.ZeroAddress, mintAmount))
        .to.be.revertedWith("Eterna: cannot mint to zero address");
    });

    it("Should fail minting zero amount", async function () {
      const { eterna, addr1 } = await loadFixture(deployEternaFixture);

      await expect(eterna.mint(addr1.address, 0))
        .to.be.revertedWith("Eterna: mint amount must be greater than 0");
    });
  });

  describe("Burning", function () {
    it("Should allow token holders to burn their tokens", async function () {
      const { eterna, owner } = await loadFixture(deployEternaFixture);

      const burnAmount = ethers.parseUnits("200", DECIMALS);
      const initialBalance = await eterna.balanceOf(owner.address);
      const initialSupply = await eterna.totalSupply();

      await expect(eterna.burn(burnAmount))
        .to.emit(eterna, "TokensBurned")
        .withArgs(owner.address, burnAmount);

      expect(await eterna.balanceOf(owner.address)).to.equal(initialBalance - burnAmount);
      expect(await eterna.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should fail burning more tokens than balance", async function () {
      const { eterna, owner } = await loadFixture(deployEternaFixture);

      const balance = await eterna.balanceOf(owner.address);
      const excessAmount = balance + ethers.parseUnits("1", DECIMALS);

      await expect(eterna.burn(excessAmount))
        .to.be.revertedWith("Eterna: insufficient balance to burn");
    });

    it("Should fail burning zero amount", async function () {
      const { eterna } = await loadFixture(deployEternaFixture);

      await expect(eterna.burn(0))
        .to.be.revertedWith("Eterna: burn amount must be greater than 0");
    });

    it("Should allow burnFrom with proper approval", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const burnAmount = ethers.parseUnits("100", DECIMALS);
      await eterna.approve(addr1.address, burnAmount);

      const initialSupply = await eterna.totalSupply();

      await expect(eterna.connect(addr1).burnFrom(owner.address, burnAmount))
        .to.emit(eterna, "TokensBurned")
        .withArgs(owner.address, burnAmount);

      expect(await eterna.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should fail burnFrom without approval", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const burnAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.connect(addr1).burnFrom(owner.address, burnAmount))
        .to.be.reverted;
    });

    it("Should fail burnFrom zero address", async function () {
      const { eterna } = await loadFixture(deployEternaFixture);

      const burnAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.burnFrom(ethers.ZeroAddress, burnAmount))
        .to.be.revertedWith("Eterna: cannot burn from zero address");
    });
  });

  describe("Balance and Supply Queries", function () {
    it("Should return correct balances", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const transferAmount = ethers.parseUnits("250", DECIMALS);
      await eterna.transfer(addr1.address, transferAmount);

      const ownerBalance = await eterna.balanceOf(owner.address);
      const addr1Balance = await eterna.balanceOf(addr1.address);

      expect(addr1Balance).to.equal(transferAmount);
      expect(ownerBalance + addr1Balance).to.equal(await eterna.totalSupply());
    });

    it("Should return zero balance for new addresses", async function () {
      const { eterna, addr1 } = await loadFixture(deployEternaFixture);

      expect(await eterna.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should maintain correct total supply after multiple operations", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      const initialSupply = await eterna.totalSupply();
      const mintAmount = ethers.parseUnits("1000", DECIMALS);
      const burnAmount = ethers.parseUnits("500", DECIMALS);

      await eterna.mint(addr1.address, mintAmount);
      await eterna.burn(burnAmount);

      expect(await eterna.totalSupply()).to.equal(initialSupply + mintAmount - burnAmount);
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      const { eterna, owner, addr1 } = await loadFixture(deployEternaFixture);

      await eterna.transferOwnership(addr1.address);
      expect(await eterna.owner()).to.equal(addr1.address);
    });

    it("Should allow new owner to mint", async function () {
      const { eterna, owner, addr1, addr2 } = await loadFixture(deployEternaFixture);

      await eterna.transferOwnership(addr1.address);

      const mintAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.connect(addr1).mint(addr2.address, mintAmount))
        .to.emit(eterna, "TokensMinted");
    });

    it("Should prevent old owner from minting after transfer", async function () {
      const { eterna, owner, addr1, addr2 } = await loadFixture(deployEternaFixture);

      await eterna.transferOwnership(addr1.address);

      const mintAmount = ethers.parseUnits("100", DECIMALS);
      await expect(eterna.connect(owner).mint(addr2.address, mintAmount))
        .to.be.revertedWithCustomError(eterna, "OwnableUnauthorizedAccount");
    });
  });
});
