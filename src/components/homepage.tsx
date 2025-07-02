"use client";
import { useRouter } from "next/navigation"
import CreateWallet from "./createWallet";
import CreateTransaction from "./Transaction"
import SocialRecoveryDemo from "./RecoverySystem"
import "@/styles/style.css"; 

export default function Homepage() {
     const router = useRouter()
      return (
    <div  className="page-container">       
      <div className="card">
        <CreateWallet />
      </div>
      <div className="card">
        <CreateTransaction />
      </div>
      <div className="card">
        <SocialRecoveryDemo />
      </div>
    </div>
  );
}