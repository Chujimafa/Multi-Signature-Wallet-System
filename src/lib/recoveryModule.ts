
import { SocialRecoveryModule, SocialRecoveryModuleGracePeriodSelector } from "abstractionkit";
import {RelayMetaTxToSafe} from "./relayMetaTxToSafe";

const gracePeriod = SocialRecoveryModuleGracePeriodSelector.After7Days;
const srm = new SocialRecoveryModule(gracePeriod); // 7 days


 async  function AddGuardians(safeAddress: string, threshold: bigint,guardianAddress: string, provider: any,) {

    const activePlugin = srm.createEnableModuleMetaTransaction(safeAddress);
    const addGuardians = srm.createAddGuardianWithThresholdMetaTransaction(guardianAddress,threshold);
    console.log("activePlugin:",activePlugin);
    console.log("addGuardians:",addGuardians);


 const activePluginTx = await RelayMetaTxToSafe(
    safeAddress,
    activePlugin,
    provider,
  );


  const addGuardiansTx = await RelayMetaTxToSafe(
    safeAddress,
    addGuardians,
    provider,
  );


  return {
    activePlugin: activePluginTx,
    addGuardians: addGuardiansTx,
  };

}

async function recovery(safeAddress: string, newOwners: string[],newThreshold:number,provider: any, ) {
    const createRecovery= srm.createConfirmRecoveryMetaTransaction(safeAddress, newOwners,newThreshold,true);
    const finalRecovery= srm.createFinalizeRecoveryMetaTransaction(safeAddress);

    const createRecoveryTx = await RelayMetaTxToSafe(
      safeAddress,
      createRecovery,
      provider,
    );
    const finalRecoveryTx = await RelayMetaTxToSafe(
      safeAddress,
      finalRecovery,
      provider,
    );

    return {
      createRecovery: createRecoveryTx,
      finalRecovery: finalRecoveryTx,
    };

}



export {AddGuardians,recovery}