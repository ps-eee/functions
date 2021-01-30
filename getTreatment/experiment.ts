import * as PlanOut from 'planout';
import { ExperimentInput } from '../interfaces/experiment-input';
import { Treatment } from '../interfaces/treatment';
import { TreatmentParam } from '../interfaces/treatment-param';
import { Variant } from '../interfaces/variant';

export class Experiment extends PlanOut.Experiment<ExperimentInput, Treatment> {

  private treatmentParams: TreatmentParam[] = [];

  constructor(experimentInput: ExperimentInput, treatmentParams: TreatmentParam[]) {

    super(experimentInput);

    this.treatmentParams = treatmentParams;

  }

  assign(planoutParams: any, experimentInput: ExperimentInput): void {

    this.treatmentParams.forEach(

      (treatmentParam: TreatmentParam): void => {

        planoutParams.set(
          treatmentParam.item,
          new PlanOut.Ops.Random.WeightedChoice({
            choices: treatmentParam.variants.map((variant: Variant) => variant.item),
            weights: treatmentParam.variants.map((variant: Variant) => variant.weight),
            unit: experimentInput.userId
          })
        );

      }

    );

  }

  configureLogger(): void { return; }

  getParamNames(): any { return this.getDefaultParamNames(); }

  log(log: any): any { console.log(log); }

  previouslyLogged(): boolean { return this._exposureLogged; }

  setup(): any { this.setName('PS-EEE'); }

}
