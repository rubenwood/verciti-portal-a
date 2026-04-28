import { Button } from "@/components/ui/button";

import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMain, supabaseTest } from "@/lib/supabase";

import { populateStageActivityJoin } from "@/app/db/general/utils";

export function StageActivityJoiner(){

    const stageParamsToStageActivityJoin = () => {
        const cajIds = ["bff8bd2b-45fa-414e-8978-a05b413a2f85",
                        "a1c89ec8-8443-4580-9dba-b0de438f1e81",
                        "22ea85c5-a87b-44f7-bc3b-90665bd248d1",
                        "131f7257-1134-4834-9624-cf30607313d4",
                        "9625426c-9614-4ba9-93ea-9b6e80cf6d96",
                        "77d24f2b-7047-4920-9729-47d023f0f722",
                        "8ac778e7-f9cc-44bf-adc8-ff571e3f5b69",
                        "780871eb-64da-40f0-b27c-440f10d2c917",
                        "54d9bf8c-455c-44b6-ac1c-5b138faa9a39",
                        "e91b2b06-6796-463b-84c9-7cf118381521",
                        "e30f4528-e20b-48e6-a06a-dd6217195cee",
                        "e8626247-f46c-42ba-9214-f5cbddc14889",
                        "93756839-3ff3-4803-a2b2-567344edc576",
                        "4188ba90-1549-4b79-a124-31bce009f504",
                        "a685241f-6b8a-49ac-8a0f-197a760a2bbd",
                        "f23ef4d4-2391-47b5-8fba-0f508537f63b",
                        "4c2cead9-ac38-42ec-8a54-ebb669dda737",
                        "786f19aa-0290-4bfa-bf8e-c1108ae39454",
                        "45eb5e67-2f56-407d-8f11-ccdbc4e62a0f",
                        "fede6a85-5103-41a6-8350-f1fb97a72eb6",
                        "929c2968-be03-4643-ad88-5a76866925d1",
                        "25a71c51-cae1-49ff-862c-6a0dbf2cd9f3",
                        "f2c1ccfc-3d03-4c0d-a3df-d65194fae979",
                        "d0fd15f3-31ac-4735-82b2-77c11ddf194a"];
        const clientToUse = supabaseTest;
        populateStageActivityJoin(clientToUse, cajIds);
    }

    return (
        <>
            <Button onClick={stageParamsToStageActivityJoin}>Migrate stages from params to stage-activity-join</Button>
        </>
    );
}