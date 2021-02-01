import * as PlanOut from 'planout';
import { Choice } from '../interfaces/choice';
import { ExperimentInput } from '../interfaces/experiment-input';
import { Treatment } from '../interfaces/treatment';
import { TreatmentParam } from '../interfaces/treatment-param';

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
            choices: treatmentParam.choices.map((choice: Choice) => choice.item),
            weights: treatmentParam.choices.map((choice: Choice) => choice.weight),
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
