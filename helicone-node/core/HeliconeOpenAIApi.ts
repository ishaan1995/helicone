import { OpenAIApi } from "openai";
import { IHeliconeConfiguration } from "./IHeliconeConfiguration";
import { HeliconeFeedback } from "./HeliconeFeedback";

export enum HeliconeFeedbackRating {
  Positive = "positive",
  Negative = "negative",
}

export const HELICONE_ID_HEADER = "helicone-id";

export class HeliconeOpenAIApi extends OpenAIApi {
  protected heliconeConfiguration: IHeliconeConfiguration;
  public helicone: Helicone;

  constructor(heliconeConfiguration: IHeliconeConfiguration) {
    super(heliconeConfiguration);
    this.heliconeConfiguration = heliconeConfiguration;
    this.helicone = new Helicone(heliconeConfiguration);
  }
}

class Helicone {
  public heliconeIdHeader = "helicone-id";

  constructor(private heliconeConfiguration: IHeliconeConfiguration) {}

  public async logFeedback(heliconeId: string, rating: HeliconeFeedbackRating) {
    const ratingAsBool = rating === HeliconeFeedbackRating.Positive;

    HeliconeFeedback.logFeedback(
      this.heliconeConfiguration,
      heliconeId,
      ratingAsBool
    );
  }
}
