"use client"
import ConnectWalletButton from "./ConnectWalletButton";
import "@/styles/style.css"; 


export default function HeaderTitle() {
    return (
        <div className="header-container">
            <h1 className="header-title" >Multi-Signature Wallet System</h1>
            <ConnectWalletButton />
        </div>
    );
}