import type { Dispatch } from "react";
import type { WizardState } from "@/lib/types";
import type { WizardAction } from "@/lib/wizard-reducer";

export interface StepProps {
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
}
